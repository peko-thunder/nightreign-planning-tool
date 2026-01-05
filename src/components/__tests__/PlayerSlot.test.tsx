import { render, screen } from '@testing-library/react';
import { PlayerSlot } from '../PlayerSlot';
import type { Player, Character } from '@/data/characters';

const mockCharacter: Character = {
  id: 'seeker',
  name: '追跡者',
  nameEn: 'Seeker',
  type: 'base',
  color: '#4a90a4',
};

const mockPlayer: Player = {
  id: 1,
  color: 'blue',
  name: 'Player 1',
  character: null,
};

describe('PlayerSlot', () => {
  it('should render player name', () => {
    render(<PlayerSlot player={mockPlayer} isSpinning={false} />);
    expect(screen.getByText('Player 1')).toBeInTheDocument();
  });

  it('should show "未選択" when no character is assigned', () => {
    render(<PlayerSlot player={mockPlayer} isSpinning={false} />);
    expect(screen.getByText('未選択')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should display assigned character', () => {
    const playerWithCharacter = { ...mockPlayer, character: mockCharacter };
    render(<PlayerSlot player={playerWithCharacter} isSpinning={false} />);

    expect(screen.getByText('追跡者')).toBeInTheDocument();
    expect(screen.getByText('Seeker')).toBeInTheDocument();
  });

  it('should show spinning character during spin', () => {
    render(
      <PlayerSlot
        player={mockPlayer}
        isSpinning={true}
        spinningCharacter={mockCharacter}
      />
    );

    expect(screen.getByText('追跡者')).toBeInTheDocument();
    expect(screen.getByText('Seeker')).toBeInTheDocument();
  });

  it('should not show character when not spinning and no assignment', () => {
    render(<PlayerSlot player={mockPlayer} isSpinning={false} />);
    expect(screen.queryByText('追跡者')).not.toBeInTheDocument();
  });

  it('should apply correct color styles for blue player', () => {
    const { container } = render(<PlayerSlot player={mockPlayer} isSpinning={false} />);
    expect(container.querySelector('.border-blue-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument();
  });

  it('should apply correct color styles for red player', () => {
    const redPlayer = { ...mockPlayer, color: 'red' as const };
    const { container } = render(<PlayerSlot player={redPlayer} isSpinning={false} />);
    expect(container.querySelector('.border-red-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-500\\/10')).toBeInTheDocument();
  });

  it('should apply correct color styles for green player', () => {
    const greenPlayer = { ...mockPlayer, color: 'green' as const };
    const { container } = render(<PlayerSlot player={greenPlayer} isSpinning={false} />);
    expect(container.querySelector('.border-green-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-500\\/10')).toBeInTheDocument();
  });

  it('should apply glow effect when character is assigned and not spinning', () => {
    const playerWithCharacter = { ...mockPlayer, character: mockCharacter };
    const { container } = render(
      <PlayerSlot player={playerWithCharacter} isSpinning={false} />
    );
    expect(container.querySelector('.shadow-\\[0_0_20px_rgba\\(59\\,130\\,246\\,0\\.3\\)\\]')).toBeInTheDocument();
  });

  it('should not apply glow effect when spinning', () => {
    const playerWithCharacter = { ...mockPlayer, character: mockCharacter };
    const { container } = render(
      <PlayerSlot player={playerWithCharacter} isSpinning={true} />
    );
    expect(container.querySelector('.shadow-\\[0_0_20px_rgba\\(59\\,130\\,246\\,0\\.3\\)\\]')).not.toBeInTheDocument();
  });
});
