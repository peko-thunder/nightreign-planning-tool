import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterIcon } from "../CharacterIcon";
import type { Character, PlayerColor } from "@/data/characters";

const mockCharacter: Character = {
  id: "seeker",
  name: "追跡者",
  nameEn: "Seeker",
  type: "base",
  color: "#4a90a4",
};

const mockCharacter2: Character = {
  id: "guardian",
  name: "守護者",
  nameEn: "Guardian",
  type: "base",
  color: "#8b7355",
};

describe("CharacterIcon", () => {
  describe("rendering", () => {
    it("should render character image with correct alt text", () => {
      render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者");
      expect(image).toBeInTheDocument();
    });

    it("should render image with correct src path", () => {
      render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者") as HTMLImageElement;
      expect(image.src).toContain("/characters/seeker.png");
    });

    it("should apply character color as background gradient", () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      const iconDiv = container.firstChild as HTMLElement;
      expect(iconDiv.style.background).toContain("#4a90a4");
    });

    it("should use default md size when no size prop is provided", () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      expect(container.querySelector(".w-20")).toBeInTheDocument();
      expect(container.querySelector(".h-24")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("should apply small size class", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} size="sm" />
      );
      expect(container.querySelector(".w-16")).toBeInTheDocument();
      expect(container.querySelector(".h-20")).toBeInTheDocument();
    });

    it("should apply medium size class", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} size="md" />
      );
      expect(container.querySelector(".w-20")).toBeInTheDocument();
      expect(container.querySelector(".h-24")).toBeInTheDocument();
    });

    it("should apply large size class", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} size="lg" />
      );
      expect(container.querySelector(".w-24")).toBeInTheDocument();
      expect(container.querySelector(".h-28")).toBeInTheDocument();
    });
  });

  describe("isLocked state", () => {
    it("should show question mark when locked", () => {
      render(<CharacterIcon character={mockCharacter} isLocked={true} />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should not show character image when locked", () => {
      render(<CharacterIcon character={mockCharacter} isLocked={true} />);
      expect(screen.queryByAltText("追跡者")).not.toBeInTheDocument();
    });

    it("should apply correct size when locked", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} isLocked={true} size="lg" />
      );
      expect(container.querySelector(".w-24")).toBeInTheDocument();
    });

    it("should not be clickable when locked", () => {
      const handleClick = jest.fn();
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          isLocked={true}
          onClick={handleClick}
        />
      );
      expect(container.querySelector(".cursor-pointer")).not.toBeInTheDocument();
    });
  });

  describe("isSelected state", () => {
    it("should apply reduced opacity when selected", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} isSelected={true} />
      );
      expect(container.querySelector(".opacity-60")).toBeInTheDocument();
    });

    it("should not apply reduced opacity when not selected", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} isSelected={false} />
      );
      expect(container.querySelector(".opacity-60")).not.toBeInTheDocument();
    });
  });

  describe("isSpinningTarget state", () => {
    it("should apply gold ring and shadow when spinning target", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} isSpinningTarget={true} />
      );
      expect(container.querySelector(".ring-2")).toBeInTheDocument();
      expect(container.querySelector(".ring-nightreign-gold")).toBeInTheDocument();
    });

    it("should not apply gold ring when spinning target but excluded", () => {
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          isSpinningTarget={true}
          isExcluded={true}
        />
      );
      expect(
        container.querySelector(".ring-nightreign-gold")
      ).not.toBeInTheDocument();
    });
  });

  describe("isExcluded state", () => {
    it("should apply reduced opacity when excluded", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} isExcluded={true} />
      );
      expect(container.querySelector(".opacity-40")).toBeInTheDocument();
    });

    it("should show × mark when excluded", () => {
      render(<CharacterIcon character={mockCharacter} isExcluded={true} />);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("should apply red color to × mark", () => {
      render(<CharacterIcon character={mockCharacter} isExcluded={true} />);
      const xMark = screen.getByText("×");
      expect(xMark).toHaveClass("text-red-500");
    });
  });

  describe("playerColors", () => {
    it("should render single player color dot", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={["blue"]} />
      );
      const dots = container.querySelectorAll(".rounded-full.bg-blue-500");
      expect(dots.length).toBe(1);
    });

    it("should render multiple player color dots", () => {
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          playerColors={["blue", "red", "green"]}
        />
      );
      expect(container.querySelector(".bg-blue-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-red-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-green-500")).toBeInTheDocument();
    });

    it("should not render dots when playerColors is empty", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={[]} />
      );
      const dotsContainer = container.querySelector(".top-1.left-1");
      expect(dotsContainer).not.toBeInTheDocument();
    });

    it("should apply selection ring when playerColors is not empty", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={["blue"]} />
      );
      expect(container.querySelector(".ring-2")).toBeInTheDocument();
    });

    it("should not apply selection ring when playerColors is empty", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={[]} />
      );
      const iconDiv = container.firstChild as HTMLElement;
      expect(iconDiv.className).not.toContain("ring-2");
    });
  });

  describe("onClick handler", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const { container } = render(
        <CharacterIcon character={mockCharacter} onClick={handleClick} />
      );

      const icon = container.firstChild as HTMLElement;
      await user.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should apply cursor-pointer class when onClick is provided", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} onClick={() => {}} />
      );
      expect(container.querySelector(".cursor-pointer")).toBeInTheDocument();
    });

    it("should not apply cursor-pointer class when onClick is not provided", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} />
      );
      expect(container.querySelector(".cursor-pointer")).not.toBeInTheDocument();
    });

    it("should apply hover:brightness-110 class when onClick is provided", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} onClick={() => {}} />
      );
      const iconDiv = container.firstChild as HTMLElement;
      expect(iconDiv.className).toContain("hover:brightness-110");
    });

    it("should handle multiple clicks", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const { container } = render(
        <CharacterIcon character={mockCharacter} onClick={handleClick} />
      );

      const icon = container.firstChild as HTMLElement;
      await user.click(icon);
      await user.click(icon);
      await user.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("image error handling", () => {
    it("should show fallback silhouette on image error", async () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者") as HTMLImageElement;

      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should use character color in fallback silhouette", async () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者") as HTMLImageElement;

      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      const ellipse = container.querySelector("ellipse");
      expect(ellipse).toHaveAttribute("fill", mockCharacter.color);
    });

    it("should reset image error state when character changes", async () => {
      const { rerender, container } = render(
        <CharacterIcon character={mockCharacter} />
      );
      const image = screen.getByAltText("追跡者") as HTMLImageElement;

      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      expect(container.querySelector("svg")).toBeInTheDocument();

      rerender(<CharacterIcon character={mockCharacter2} />);

      expect(screen.getByAltText("守護者")).toBeInTheDocument();
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("combined states", () => {
    it("should handle isSelected and playerColors together", () => {
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          isSelected={true}
          playerColors={["blue", "red"]}
        />
      );
      expect(container.querySelector(".opacity-60")).toBeInTheDocument();
      expect(container.querySelector(".bg-blue-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-red-500")).toBeInTheDocument();
    });

    it("should handle isExcluded and isSelected together", () => {
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          isExcluded={true}
          isSelected={true}
        />
      );
      expect(container.querySelector(".opacity-40")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("should prioritize spinning target ring over selection ring when not excluded", () => {
      const { container } = render(
        <CharacterIcon
          character={mockCharacter}
          isSpinningTarget={true}
          playerColors={["blue"]}
        />
      );
      expect(container.querySelector(".ring-nightreign-gold")).toBeInTheDocument();
    });
  });

  describe("FallbackSilhouette", () => {
    it("should render SVG with correct viewBox", async () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者") as HTMLImageElement;

      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 80 96");
    });

    it("should contain head and body shapes", async () => {
      const { container } = render(<CharacterIcon character={mockCharacter} />);
      const image = screen.getByAltText("追跡者") as HTMLImageElement;

      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      const ellipses = container.querySelectorAll("ellipse");
      const paths = container.querySelectorAll("path");
      expect(ellipses.length).toBeGreaterThanOrEqual(2);
      expect(paths.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("edge cases", () => {
    it("should handle character with special characters in name", () => {
      const specialCharacter: Character = {
        id: "test-special",
        name: "テスト<キャラ>",
        nameEn: "Test Character",
        type: "base",
        color: "#000000",
      };
      render(<CharacterIcon character={specialCharacter} />);
      expect(screen.getByAltText("テスト<キャラ>")).toBeInTheDocument();
    });

    it("should handle empty playerColors array", () => {
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={[]} />
      );
      const iconDiv = container.firstChild as HTMLElement;
      expect(iconDiv).toBeInTheDocument();
      expect(iconDiv.className).not.toContain("ring-");
    });

    it("should handle all three player colors", () => {
      const colors: PlayerColor[] = ["blue", "red", "green"];
      const { container } = render(
        <CharacterIcon character={mockCharacter} playerColors={colors} />
      );
      colors.forEach((color) => {
        expect(container.querySelector(`.bg-${color}-500`)).toBeInTheDocument();
      });
    });
  });
});
