import { DEFAULT_SETTINGS, DEFAULT_POSITION_ORDER, STORAGE_KEYS } from "@/lib/constants";
import { AppSettings, Game } from "@/types/game";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadGames(): Game[] {
  if (typeof window === "undefined") return [];

  const games = safeParse<Game[]>(
    window.localStorage.getItem(STORAGE_KEYS.GAMES),
    []
  );

  return games.map((game) => {
    const playerPositions =
      game.playerPositions ??
      Object.fromEntries(
        game.players.map((player, index) => [
          player.id,
          DEFAULT_POSITION_ORDER[index],
        ])
      );

    return {
      ...game,
      playerPositions,
      players: game.players.map((player) => ({
        ...player,
        isRiichi: player.isRiichi ?? false,
      })),
    };
  });
}

export function saveGames(games: Game[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
}

export function loadActiveGameId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME_ID);
}

export function saveActiveGameId(gameId: string | null) {
  if (typeof window === "undefined") return;

  if (!gameId) {
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME_ID);
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME_ID, gameId);
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  return safeParse<AppSettings>(
    window.localStorage.getItem(STORAGE_KEYS.SETTINGS),
    DEFAULT_SETTINGS
  );
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}