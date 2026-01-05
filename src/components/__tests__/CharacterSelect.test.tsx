import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterSelect } from '../CharacterSelect';
import { CHARACTERS } from '@/data/characters';
import type { PlayerColor } from '@/data/characters';

describe('CharacterSelect', () => {
  it('should render all characters', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    render(<CharacterSelect selectedCharacters={selectedCharacters} />);

    CHARACTERS.forEach((character) => {
      const image = screen.getByAltText(character.name);
      expect(image).toBeInTheDocument();
    });
  });

  it('should render 10 character icons', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    const { container } = render(<CharacterSelect selectedCharacters={selectedCharacters} />);

    const icons = container.querySelectorAll('[alt]');
    expect(icons.length).toBe(10);
  });

  it('should show player colors on selected characters', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    selectedCharacters.set('seeker', ['blue', 'red']);

    const { container } = render(<CharacterSelect selectedCharacters={selectedCharacters} />);
    const blueDots = container.querySelectorAll('.bg-blue-500');
    const redDots = container.querySelectorAll('.bg-red-500');

    expect(blueDots.length).toBeGreaterThan(0);
    expect(redDots.length).toBeGreaterThan(0);
  });

  it('should call onCharacterClick when character is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const selectedCharacters = new Map<string, PlayerColor[]>();

    render(
      <CharacterSelect
        selectedCharacters={selectedCharacters}
        onCharacterClick={handleClick}
      />
    );

    const seekerImage = screen.getByAltText('追跡者');
    const seekerIcon = seekerImage.parentElement;

    if (seekerIcon) {
      await user.click(seekerIcon);
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'seeker' })
      );
    }
  });

  it('should show locked characters', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    const lockedCharacterIds = new Set(['seeker', 'guardian']);

    render(
      <CharacterSelect
        selectedCharacters={selectedCharacters}
        lockedCharacterIds={lockedCharacterIds}
      />
    );

    // Locked characters should show "?" instead of images
    const questionMarks = screen.getAllByText('?');
    expect(questionMarks.length).toBeGreaterThanOrEqual(2);
  });

  it('should highlight spinning characters', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    const spinningCharacters = [
      CHARACTERS.find((c) => c.id === 'seeker')!,
      null,
      null,
    ];

    const { container } = render(
      <CharacterSelect
        selectedCharacters={selectedCharacters}
        spinningCharacters={spinningCharacters}
      />
    );

    // Spinning characters should have a golden ring
    const goldRings = container.querySelectorAll('.ring-nightreign-gold');
    expect(goldRings.length).toBeGreaterThan(0);
  });

  it('should handle empty selected characters', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    render(<CharacterSelect selectedCharacters={selectedCharacters} />);

    CHARACTERS.forEach((character) => {
      const image = screen.getByAltText(character.name);
      expect(image).toBeInTheDocument();
    });
  });

  it('should display characters in grid layout', () => {
    const selectedCharacters = new Map<string, PlayerColor[]>();
    const { container } = render(<CharacterSelect selectedCharacters={selectedCharacters} />);

    const grid = container.querySelector('.grid-cols-5');
    expect(grid).toBeInTheDocument();
  });
});
