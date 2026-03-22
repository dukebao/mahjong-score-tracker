import { AppSettings, PlayerSeat, Ruleset, TablePosition } from "@/types/game";

export const RULESET_OPTIONS: { label: string; value: Ruleset }[] = [
  { label: "Riichi", value: "riichi" },
  { label: "Hong Kong", value: "hong-kong" },
  { label: "Taiwanese", value: "taiwanese" },
  { label: "Manual / House Rules", value: "manual" },
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultRuleset: "riichi",
  defaultStartingScore: 25000,
};

export const DEFAULT_SEATS: PlayerSeat[] = ["east", "north", "west", "south"];

export const DEFAULT_POSITION_ORDER: TablePosition[] = [
  "top",
  "right",
  "bottom",
  "left",
];

export const QUICK_POINT_VALUES = [1000, 2000, 3900, 5200, 7700, 8000, 12000];

export const STORAGE_KEYS = {
  GAMES: "mahjong:games",
  ACTIVE_GAME_ID: "mahjong:activeGameId",
  SETTINGS: "mahjong:settings",
} as const;