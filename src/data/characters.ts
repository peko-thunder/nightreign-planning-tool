export type CharacterType = "base" | "unlock" | "dlc";

export interface Character {
  id: string;
  name: string;
  nameEn: string;
  type: CharacterType;
  color: string;
}

export const CHARACTERS: Character[] = [
  { id: "seeker", name: "追跡者", nameEn: "Seeker", type: "base", color: "#4a90a4" },
  { id: "guardian", name: "守護者", nameEn: "Guardian", type: "base", color: "#8b7355" },
  { id: "iron-eye", name: "鉄の目", nameEn: "Iron Eye", type: "base", color: "#4a7c59" },
  { id: "lady", name: "レディ", nameEn: "Lady", type: "unlock", color: "#9370db" },
  { id: "raider", name: "無頼漢", nameEn: "Raider", type: "base", color: "#8b4513" },
  { id: "avenger", name: "復讐者", nameEn: "Avenger", type: "unlock", color: "#2f4f4f" },
  { id: "hermit", name: "隠者", nameEn: "Hermit", type: "base", color: "#6b5b95" },
  { id: "executor", name: "執行者", nameEn: "Executor", type: "base", color: "#c41e3a" },
  { id: "scholar", name: "学者", nameEn: "Scholar", type: "dlc", color: "#daa520" },
  { id: "undertaker", name: "葬儀屋", nameEn: "Undertaker", type: "dlc", color: "#1a1a2e" },
];

export type PlayerColor = "blue" | "red" | "green";

export interface Player {
  id: number;
  color: PlayerColor;
  name: string;
  character: Character | null;
}

export const INITIAL_PLAYERS: Player[] = [
  { id: 1, color: "blue", name: "Player 1", character: null },
  { id: 2, color: "red", name: "Player 2", character: null },
  { id: 3, color: "green", name: "Player 3", character: null },
];
