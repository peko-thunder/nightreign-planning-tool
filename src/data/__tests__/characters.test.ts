import { CHARACTERS, INITIAL_PLAYERS, type Character, type CharacterType, type PlayerColor } from '../characters';

describe('characters data', () => {
  describe('CHARACTERS', () => {
    it('should have 10 characters', () => {
      expect(CHARACTERS).toHaveLength(10);
    });

    it('should have all required properties', () => {
      CHARACTERS.forEach((character) => {
        expect(character).toHaveProperty('id');
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('nameEn');
        expect(character).toHaveProperty('type');
        expect(character).toHaveProperty('color');
        expect(typeof character.id).toBe('string');
        expect(typeof character.name).toBe('string');
        expect(typeof character.nameEn).toBe('string');
        expect(typeof character.color).toBe('string');
      });
    });

    it('should have valid character types', () => {
      const validTypes: CharacterType[] = ['base', 'unlock', 'dlc'];
      CHARACTERS.forEach((character) => {
        expect(validTypes).toContain(character.type);
      });
    });

    it('should have correct number of each type', () => {
      const baseCharacters = CHARACTERS.filter((c) => c.type === 'base');
      const unlockCharacters = CHARACTERS.filter((c) => c.type === 'unlock');
      const dlcCharacters = CHARACTERS.filter((c) => c.type === 'dlc');

      expect(baseCharacters).toHaveLength(6);
      expect(unlockCharacters).toHaveLength(2);
      expect(dlcCharacters).toHaveLength(2);
    });

    it('should have unique IDs', () => {
      const ids = CHARACTERS.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(CHARACTERS.length);
    });

    it('should have specific characters', () => {
      const characterIds = CHARACTERS.map((c) => c.id);
      expect(characterIds).toContain('seeker');
      expect(characterIds).toContain('guardian');
      expect(characterIds).toContain('iron-eye');
      expect(characterIds).toContain('lady');
      expect(characterIds).toContain('raider');
      expect(characterIds).toContain('avenger');
      expect(characterIds).toContain('hermit');
      expect(characterIds).toContain('executor');
      expect(characterIds).toContain('scholar');
      expect(characterIds).toContain('undertaker');
    });
  });

  describe('INITIAL_PLAYERS', () => {
    it('should have 3 players', () => {
      expect(INITIAL_PLAYERS).toHaveLength(3);
    });

    it('should have all required properties', () => {
      INITIAL_PLAYERS.forEach((player) => {
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('color');
        expect(player).toHaveProperty('name');
        expect(player).toHaveProperty('character');
        expect(typeof player.id).toBe('number');
        expect(typeof player.name).toBe('string');
      });
    });

    it('should have valid player colors', () => {
      const validColors: PlayerColor[] = ['blue', 'red', 'green'];
      INITIAL_PLAYERS.forEach((player) => {
        expect(validColors).toContain(player.color);
      });
    });

    it('should have unique colors', () => {
      const colors = INITIAL_PLAYERS.map((p) => p.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(INITIAL_PLAYERS.length);
    });

    it('should have null characters initially', () => {
      INITIAL_PLAYERS.forEach((player) => {
        expect(player.character).toBeNull();
      });
    });

    it('should have correct player setup', () => {
      expect(INITIAL_PLAYERS[0]).toMatchObject({
        id: 1,
        color: 'blue',
        name: 'Player 1',
        character: null,
      });
      expect(INITIAL_PLAYERS[1]).toMatchObject({
        id: 2,
        color: 'red',
        name: 'Player 2',
        character: null,
      });
      expect(INITIAL_PLAYERS[2]).toMatchObject({
        id: 3,
        color: 'green',
        name: 'Player 3',
        character: null,
      });
    });
  });
});
