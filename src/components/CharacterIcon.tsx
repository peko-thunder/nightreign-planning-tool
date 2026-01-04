"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Character, PlayerColor } from "@/data/characters";

interface CharacterIconProps {
  character: Character;
  size?: "sm" | "md" | "lg";
  isSelected?: boolean;
  isSpinningTarget?: boolean;
  isLocked?: boolean;
  playerColors?: PlayerColor[];
  onClick?: () => void;
}

const sizeStyles = {
  sm: { className: "w-16 h-20", width: 64, height: 80 },
  md: { className: "w-20 h-24", width: 80, height: 96 },
  lg: { className: "w-24 h-28", width: 96, height: 112 },
};

const playerDotColors: Record<PlayerColor, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
};

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

export function CharacterIcon({
  character,
  size = "md",
  isSelected = false,
  isSpinningTarget = false,
  isLocked = false,
  playerColors = [],
  onClick,
}: CharacterIconProps) {
  const [imageError, setImageError] = useState(false);
  const sizeStyle = sizeStyles[size];
  const imagePath = `/characters/${character.id}.png`;
  const hasSelection = playerColors.length > 0;

  useEffect(() => {
    setImageError(false);
  }, [character.id]);

  const ringStyle = (() => {
    if (isSpinningTarget) {
      return "ring-2 ring-nightreign-gold shadow-[0_0_12px_rgba(201,162,39,0.6)]";
    }
    if (hasSelection) {
      return "ring-2 ring-[#DDDFE7] shadow-[0_0_8px_rgba(221,223,231,0.5)]";
    }
    return "";
  })();

  if (isLocked) {
    return (
      <div
        className={`
          ${sizeStyle.className}
          relative overflow-hidden
          transition-all duration-75
        `}
        style={{
          background: "linear-gradient(160deg, #1a1a2420 0%, #1a1a2450 50%, #1a1a2430 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl text-gray-600 font-bold select-none">?</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeStyle.className}
        relative overflow-hidden
        ${ringStyle}
        ${isSelected ? "opacity-60" : ""}
        ${onClick ? "cursor-pointer hover:brightness-110" : ""}
        transition-all duration-75
      `}
      style={{
        background: `linear-gradient(160deg, ${character.color}20 0%, ${character.color}50 50%, ${character.color}30 100%)`,
      }}
      onClick={onClick}
    >
      {imageError ? (
        <FallbackSilhouette color={character.color} />
      ) : (
        <Image
          src={imagePath}
          alt={character.name}
          width={sizeStyle.width}
          height={sizeStyle.height}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* 暗いオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* プレイヤー色の丸円（左上） */}
      {playerColors.length > 0 && (
        <div className="absolute top-1 left-1 flex gap-0.5">
          {playerColors.map((color) => (
            <div
              key={color}
              className={`w-3 h-3 rounded-full ${playerDotColors[color]} ring-1 ring-black/30`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
