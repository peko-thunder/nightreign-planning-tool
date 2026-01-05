import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterIcon } from '../CharacterIcon';
import type { Character } from '@/data/characters';

const mockCharacter: Character = {
  id: 'seeker',
  name: '追跡者',
  nameEn: 'Seeker',
  type: 'base',
  color: '#4a90a4',
};

describe('CharacterIcon', () => {
  it('should render character image', () => {
    render(<CharacterIcon character={mockCharacter} />);
    const image = screen.getByAltText('追跡者');
    expect(image).toBeInTheDocument();
  });

  it('should apply correct size class', () => {
    const { rerender, container } = render(
      <CharacterIcon character={mockCharacter} size="sm" />
    );
    expect(container.querySelector('.w-16')).toBeInTheDocument();

    rerender(<CharacterIcon character={mockCharacter} size="md" />);
    expect(container.querySelector('.w-20')).toBeInTheDocument();

    rerender(<CharacterIcon character={mockCharacter} size="lg" />);
    expect(container.querySelector('.w-24')).toBeInTheDocument();
  });

  it('should show locked state', () => {
    render(<CharacterIcon character={mockCharacter} isLocked={true} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<CharacterIcon character={mockCharacter} onClick={handleClick} />);

    const icon = screen.getByAltText('追跡者').parentElement;
    if (icon) {
      await user.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should render player color dots', () => {
    const { container } = render(
      <CharacterIcon character={mockCharacter} playerColors={['blue', 'red']} />
    );
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThanOrEqual(2);
  });

  it('should apply selected opacity', () => {
    const { container } = render(
      <CharacterIcon character={mockCharacter} isSelected={true} />
    );
    expect(container.querySelector('.opacity-60')).toBeInTheDocument();
  });

  it('should not apply selected opacity when not selected', () => {
    const { container } = render(
      <CharacterIcon character={mockCharacter} isSelected={false} />
    );
    expect(container.querySelector('.opacity-60')).not.toBeInTheDocument();
  });

  it('should show fallback silhouette on image error', async () => {
    const { container } = render(<CharacterIcon character={mockCharacter} />);
    const image = screen.getByAltText('追跡者') as HTMLImageElement;

    // Trigger image error
    await act(async () => {
      image.dispatchEvent(new Event('error'));
    });

    // SVG should be rendered as fallback
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
