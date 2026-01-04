"use client";

import { useMemo } from "react";
import { CHARACTERS, type Character, type PlayerColor } from "@/data/characters";
import { CharacterIcon } from "./CharacterIcon";

interface CharacterSelectProps {
  selectedCharacters: Map<string, PlayerColor[]>;
  spinningCharacters?: (Character | null)[];
  onCharacterClick?: (character: Character) => void;
}

export function CharacterSelect({
  selectedCharacters,
  spinningCharacters,
  onCharacterClick,
}: CharacterSelectProps) {
  const getPlayerColors = (characterId: string): PlayerColor[] => {
    return selectedCharacters.get(characterId) ?? [];
  };

  const spinningCharacterIds = useMemo(() => {
    if (!spinningCharacters) return new Set<string>();
    return new Set(
      spinningCharacters
        .filter((c): c is Character => c !== null)
        .map((c) => c.id)
    );
  }, [spinningCharacters]);

  return (
    <div className="flex justify-center">
      <div className="inline-grid grid-cols-5 gap-[5px] bg-gray-900/80 p-[2px] rounded">
        {CHARACTERS.map((character) => {
          const playerColors = getPlayerColors(character.id);
          const isSpinningTarget = spinningCharacterIds.has(character.id);
          return (
            <CharacterIcon
              key={character.id}
              character={character}
              size="md"
              isSelected={playerColors.length > 0}
              isSpinningTarget={isSpinningTarget}
              playerColors={playerColors}
              onClick={onCharacterClick ? () => onCharacterClick(character) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
