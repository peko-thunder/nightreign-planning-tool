"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { CHARACTERS, INITIAL_PLAYERS, type Player, type Character, type PlayerColor, type CharacterType } from "@/data/characters";
import { CharacterSelect } from "./CharacterSelect";
import { PlayerSlot } from "./PlayerSlot";

type UnlockedTypes = Record<CharacterType, boolean>;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getAvailableCharacters(unlockedTypes: UnlockedTypes): Character[] {
  return CHARACTERS.filter((c) => unlockedTypes[c.type]);
}

function selectRandomCharacters(allowDuplicates: boolean, availableCharacters: Character[]): Character[] {
  if (availableCharacters.length === 0) return [];
  if (allowDuplicates) {
    return Array.from({ length: 3 }, () =>
      availableCharacters[Math.floor(Math.random() * availableCharacters.length)]
    );
  }
  const shuffled = shuffleArray(availableCharacters);
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

function getRandomCharacter(availableCharacters: Character[]): Character {
  return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
}

export function Roulette() {
  const [players, setPlayers] = useState<Player[]>(
    INITIAL_PLAYERS.map((p) => ({ ...p }))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [unlockedTypes, setUnlockedTypes] = useState<UnlockedTypes>({
    base: true,
    unlock: true,
    dlc: true,
  });
  const [spinningCharacters, setSpinningCharacters] = useState<(Character | null)[]>([null, null, null]);
  const spinIntervalsRef = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

  const availableCharacters = useMemo(
    () => getAvailableCharacters(unlockedTypes),
    [unlockedTypes]
  );

  const lockedCharacterIds = useMemo(
    () => new Set(CHARACTERS.filter((c) => !unlockedTypes[c.type]).map((c) => c.id)),
    [unlockedTypes]
  );

  const selectedCharactersMap = useMemo(() => {
    const map = new Map<string, PlayerColor[]>();
    players.forEach((player) => {
      if (player.character) {
        const existing = map.get(player.character.id) ?? [];
        map.set(player.character.id, [...existing, player.color]);
      }
    });
    return map;
  }, [players]);

  const stopSpinInterval = useCallback((index: number) => {
    if (spinIntervalsRef.current[index]) {
      clearInterval(spinIntervalsRef.current[index]!);
      spinIntervalsRef.current[index] = null;
    }
  }, []);

  const startSpinInterval = useCallback((index: number) => {
    stopSpinInterval(index);
    spinIntervalsRef.current[index] = setInterval(() => {
      setSpinningCharacters((prev) => {
        const next = [...prev];
        next[index] = getRandomCharacter(availableCharacters);
        return next;
      });
    }, 80);
  }, [stopSpinInterval, availableCharacters]);

  useEffect(() => {
    return () => {
      spinIntervalsRef.current.forEach((_, index) => {
        if (spinIntervalsRef.current[index]) {
          clearInterval(spinIntervalsRef.current[index]!);
        }
      });
    };
  }, []);

  const startRoulette = useCallback(() => {
    if (isSpinning || isStopping) return;
    if (availableCharacters.length === 0) return;

    setIsSpinning(true);
    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));

    players.forEach((_, index) => {
      startSpinInterval(index);
    });
  }, [isSpinning, isStopping, players, availableCharacters, startSpinInterval]);

  const stopRoulette = useCallback(async () => {
    if (!isSpinning || isStopping) return;

    setIsStopping(true);

    const selectedCharacters = selectRandomCharacters(allowDuplicates, availableCharacters);

    const spinPromises = players.map((_, index) => {
      const duration = 300 + index * 500;
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          stopSpinInterval(index);
          setSpinningCharacters((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
          });
          setPlayers((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], character: selectedCharacters[index] };
            return next;
          });
          resolve();
        }, duration);
      });
    });

    await Promise.all(spinPromises);

    setIsSpinning(false);
    setIsStopping(false);
  }, [isSpinning, isStopping, players, allowDuplicates, availableCharacters, startSpinInterval, stopSpinInterval]);

  const resetRoulette = useCallback(() => {
    if (isSpinning || isStopping) return;

    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));
  }, [isSpinning, isStopping]);

  return (
    <div className="flex flex-col gap-4">
      {/* 上部：キャラクター一覧 */}
      <CharacterSelect
        selectedCharacters={selectedCharactersMap}
        spinningCharacters={spinningCharacters}
        lockedCharacterIds={lockedCharacterIds}
      />

      {/* 下部：プレイヤースロット */}
      <div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {players.map((player, index) => (
            <PlayerSlot
              key={player.id}
              player={player}
              isSpinning={isSpinning && !player.character}
              spinningCharacter={spinningCharacters[index]}
            />
          ))}
        </div>

        {/* オプション */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-3">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              disabled={isSpinning || isStopping}
              className="w-4 h-4 accent-nightreign-gold cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm">キャラクター被りを許可</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unlockedTypes.unlock}
              onChange={(e) => setUnlockedTypes((prev) => ({ ...prev, unlock: e.target.checked }))}
              disabled={isSpinning || isStopping}
              className="w-4 h-4 accent-nightreign-gold cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm">解放キャラを含む</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unlockedTypes.dlc}
              onChange={(e) => setUnlockedTypes((prev) => ({ ...prev, dlc: e.target.checked }))}
              disabled={isSpinning || isStopping}
              className="w-4 h-4 accent-nightreign-gold cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm">DLCキャラを含む</span>
          </label>
        </div>

        {/* コントロールボタン */}
        <div className="flex items-center justify-center gap-4">
          {!isSpinning && !isStopping ? (
            <button
              onClick={startRoulette}
              disabled={availableCharacters.length === 0}
              className="px-8 py-3 bg-nightreign-gold text-nightreign-bg font-bold text-lg rounded
                         hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_20px_rgba(201,162,39,0.4)]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopRoulette}
              disabled={isStopping}
              className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded
                         hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isStopping ? "停止中..." : "Stop"}
            </button>
          )}

          <button
            onClick={resetRoulette}
            disabled={isSpinning || isStopping}
            className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded
                       hover:bg-gray-600 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
