"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Player, Character } from "@/data/characters";
import { CHARACTERS } from "@/data/characters";

interface PlayerSlotProps {
  player: Player;
  isSpinning: boolean;
  spinningCharacter?: Character | null;
}

const colorStyles = {
  blue: {
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    marker: "bg-blue-500",
  },
  red: {
    border: "border-red-500",
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    marker: "bg-red-500",
  },
  green: {
    border: "border-green-500",
    bg: "bg-green-500/10",
    text: "text-green-400",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    marker: "bg-green-500",
  },
};

let imagesPreloaded = false;

function preloadCharacterImages() {
  if (imagesPreloaded || typeof window === "undefined") return;
  imagesPreloaded = true;

  CHARACTERS.forEach((character) => {
    const img = new window.Image();
    img.src = `/characters/${character.id}.png`;
  });
}

function FallbackSilhouette({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="40" cy="32" rx="18" ry="20" fill={color} opacity="0.7" />
      <path d="M15 96 C15 65, 65 65, 65 96" fill={color} opacity="0.5" />
      <ellipse cx="40" cy="30" rx="14" ry="16" fill="#ffffff" opacity="0.1" />
    </svg>
  );
}

function CharacterPortrait({ character, isSpinning }: { character: Character; isSpinning: boolean }) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/characters/${character.id}.png`;

  useEffect(() => {
    setImageError(false);
  }, [character.id]);

  return (
    <div
      className={`w-20 h-24 relative overflow-hidden rounded ${isSpinning ? "" : "animate-result-pop"}`}
      style={{
        background: `linear-gradient(160deg, ${character.color}20 0%, ${character.color}50 50%, ${character.color}30 100%)`,
      }}
    >
      {imageError ? (
        <FallbackSilhouette color={character.color} />
      ) : (
        <Image
          src={imagePath}
          alt={character.name}
          width={80}
          height={96}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

function SpinningPortrait({ character }: { character: Character }) {
  const imagePath = `/characters/${character.id}.png`;

  return (
    <div
      className="w-20 h-24 relative overflow-hidden rounded"
      style={{
        background: `linear-gradient(160deg, ${character.color}20 0%, ${character.color}50 50%, ${character.color}30 100%)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt={character.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

export function PlayerSlot({ player, isSpinning, spinningCharacter }: PlayerSlotProps) {
  const styles = colorStyles[player.color];
  const showCharacter = !isSpinning && player.character;
  const showSpinningCharacter = isSpinning && spinningCharacter;

  useEffect(() => {
    preloadCharacterImages();
  }, []);

  return (
    <div
      className={`
        relative flex flex-col items-center pt-6 pb-3 px-3 rounded-lg
        border ${styles.border} ${styles.bg}
        ${player.character && !isSpinning ? styles.glow : ""}
        transition-all duration-300
        h-[185px]
      `}
    >
      {/* プレイヤーマーカー */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${styles.marker}`} />
        <span className={`text-xs font-bold ${styles.text}`}>{player.name}</span>
      </div>

      {/* キャラクター表示エリア */}
      <div className="flex flex-col items-center justify-center flex-1">
        {showCharacter ? (
          <>
            <CharacterPortrait character={player.character!} isSpinning={false} />
            <div className="mt-1 text-center">
              <div className="text-sm font-bold text-nightreign-gold">{player.character!.name}</div>
              <div className="text-[10px] text-gray-500">{player.character!.nameEn}</div>
            </div>
          </>
        ) : showSpinningCharacter ? (
          <>
            <SpinningPortrait character={spinningCharacter} />
            <div className="mt-1 text-center">
              <div className="text-sm font-bold text-gray-400">{spinningCharacter.name}</div>
              <div className="text-[10px] text-gray-600">{spinningCharacter.nameEn}</div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-24 rounded border border-dashed border-gray-700 flex items-center justify-center bg-gray-900/30">
              <span className="text-2xl text-gray-600">?</span>
            </div>
            <div className="mt-1 text-center">
              <div className="text-sm font-bold text-gray-600">未選択</div>
              <div className="text-[10px] text-transparent">-</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
