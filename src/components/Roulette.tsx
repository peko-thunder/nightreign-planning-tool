"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { CHARACTERS, INITIAL_PLAYERS, type Player, type Character, type PlayerColor } from "@/data/characters";
import { CharacterSelect } from "./CharacterSelect";
import { PlayerSlot } from "./PlayerSlot";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectRandomCharacters(allowDuplicates: boolean): Character[] {
  if (allowDuplicates) {
    return Array.from({ length: 3 }, () =>
      CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    );
  }
  const shuffled = shuffleArray(CHARACTERS);
  return shuffled.slice(0, 3);
}

function getRandomCharacter(): Character {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

export function Roulette() {
  const [players, setPlayers] = useState<Player[]>(
    INITIAL_PLAYERS.map((p) => ({ ...p }))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [buttonText, setButtonText] = useState("ルーレット開始");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [spinningCharacters, setSpinningCharacters] = useState<(Character | null)[]>([null, null, null]);
  const spinIntervalsRef = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

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
        next[index] = getRandomCharacter();
        return next;
      });
    }, 80);
  }, [stopSpinInterval]);

  useEffect(() => {
    return () => {
      spinIntervalsRef.current.forEach((_, index) => {
        if (spinIntervalsRef.current[index]) {
          clearInterval(spinIntervalsRef.current[index]!);
        }
      });
    };
  }, []);

  const startRoulette = useCallback(async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setButtonText("抽選中...");

    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));

    players.forEach((_, index) => {
      startSpinInterval(index);
    });

    const selectedCharacters = selectRandomCharacters(allowDuplicates);

    const spinPromises = players.map((_, index) => {
      const duration = 1500 + index * 500;
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
    setButtonText("もう一度回す");
  }, [isSpinning, players, allowDuplicates, startSpinInterval, stopSpinInterval]);

  const resetRoulette = useCallback(() => {
    if (isSpinning) return;

    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));
    setButtonText("ルーレット開始");
  }, [isSpinning]);

  return (
    <div className="flex flex-col gap-4">
      {/* 上部：キャラクター一覧 */}
      <CharacterSelect
        selectedCharacters={selectedCharactersMap}
        spinningCharacters={spinningCharacters}
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
        <div className="flex items-center justify-center mb-3">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              disabled={isSpinning}
              className="w-4 h-4 accent-nightreign-gold cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm">キャラクター被りを許可</span>
          </label>
        </div>

        {/* コントロールボタン */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={startRoulette}
            disabled={isSpinning}
            className="px-8 py-3 bg-nightreign-gold text-nightreign-bg font-bold text-lg rounded
                       hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_20px_rgba(201,162,39,0.4)]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {buttonText}
          </button>

          <button
            onClick={resetRoulette}
            disabled={isSpinning}
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
