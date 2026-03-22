"use client";

import {
  DEFAULT_POSITION_ORDER,
  DEFAULT_SEATS,
  DEFAULT_SETTINGS,
} from "@/lib/constants";
import {
  loadActiveGameId,
  loadGames,
  loadSettings,
  saveActiveGameId,
  saveGames,
  saveSettings,
} from "@/lib/storage";
import { AppSettings, Game, RoundAdjustment, RoundRecord, RoundType, Ruleset } from "@/types/game";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { rotateSeatsAntiClockwise } from "@/lib/score-utils";

type CreateGameInput = {
  name?: string;
  ruleset: Ruleset;
  startingScore: number;
  players: string[];
};

type AddRoundInput = {
  gameId: string;
  type: RoundType;
  adjustments: RoundAdjustment[];
  note?: string;
  riichiPoolAwarded?: number;
  winnerPlayerId?: string;
  discarderPlayerId?: string;
  enteredValue?: number;
};

type GameStore = {
  games: Game[];
  activeGameId: string | null;
  settings: AppSettings;
  initialized: boolean;

  initialize: () => void;
  createGame: (input: CreateGameInput) => string;
  setActiveGame: (gameId: string | null) => void;
  addRound: (input: AddRoundInput) => void;
  undoLastRound: (gameId: string) => void;
  finishGame: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  rotateSeatsAntiClockwise: (gameId: string) => void;
  togglePlayerRiichi: (gameId: string, playerId: string) => void;
  getGameById: (gameId: string) => Game | undefined;
};

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  activeGameId: null,
  settings: DEFAULT_SETTINGS,
  initialized: false,

  initialize: () => {
    if (get().initialized) return;

    set({
      games: loadGames(),
      activeGameId: loadActiveGameId(),
      settings: loadSettings(),
      initialized: true,
    });
  },

  createGame: (input) => {
    const now = new Date().toISOString();

    const players = input.players.map((name, index) => ({
      id: nanoid(),
      name: name.trim(),
      seat: DEFAULT_SEATS[index],
      isRiichi: false,
    }));

    const playerPositions = Object.fromEntries(
      players.map((player, index) => [player.id, DEFAULT_POSITION_ORDER[index]])
    );

    const game: Game = {
      id: nanoid(),
      name: input.name?.trim() || undefined,
      ruleset: input.ruleset,
      startingScore: input.startingScore,
      status: "active",
      createdAt: now,
      updatedAt: now,
      players,
      rounds: [],
      playerPositions,
    };

    const nextGames = [game, ...get().games];
    saveGames(nextGames);
    saveActiveGameId(game.id);

    set({
      games: nextGames,
      activeGameId: game.id,
    });

    return game.id;
  },

  setActiveGame: (gameId) => {
    saveActiveGameId(gameId);
    set({ activeGameId: gameId });
  },

  addRound: ({
    gameId,
    type,
    adjustments,
    note,
    riichiPoolAwarded,
    winnerPlayerId,
    discarderPlayerId,
    enteredValue,
  }) => {
    const nextGames = get().games.map((game) => {
      if (game.id !== gameId) return game;

      const round: RoundRecord = {
        id: nanoid(),
        roundNumber: game.rounds.length + 1,
        type,
        adjustments,
        note: note?.trim() || undefined,
        createdAt: new Date().toISOString(),
        riichiPoolAwarded,
        winnerPlayerId,
        discarderPlayerId,
        enteredValue,
      };

      return {
        ...game,
        players: game.players.map((player) => ({
          ...player,
          isRiichi: false,
        })),
        rounds: [...game.rounds, round],
        updatedAt: new Date().toISOString(),
      };
    });

    saveGames(nextGames);
    set({ games: nextGames });
  },

  undoLastRound: (gameId) => {
    const nextGames = get().games.map((game) => {
      if (game.id !== gameId) return game;
      if (game.rounds.length === 0) return game;

      return {
        ...game,
        rounds: game.rounds.slice(0, -1),
        updatedAt: new Date().toISOString(),
      };
    });

    saveGames(nextGames);
    set({ games: nextGames });
  },

  finishGame: (gameId) => {
    const nextGames = get().games.map((game) =>
      game.id === gameId
        ? {
            ...game,
            status: "finished",
            updatedAt: new Date().toISOString(),
          }
        : game
    );

    saveGames(nextGames);
    set({ games: nextGames });
  },

  deleteGame: (gameId) => {
    const nextGames = get().games.filter((game) => game.id !== gameId);
    const nextActiveGameId =
      get().activeGameId === gameId ? null : get().activeGameId;

    saveGames(nextGames);
    saveActiveGameId(nextActiveGameId);

    set({
      games: nextGames,
      activeGameId: nextActiveGameId,
    });
  },

  updateSettings: (partialSettings) => {
    const nextSettings = { ...get().settings, ...partialSettings };
    saveSettings(nextSettings);
    set({ settings: nextSettings });
  },

  rotateSeatsAntiClockwise: (gameId) => {
    const nextGames = get().games.map((game) => {
      if (game.id !== gameId) return game;

      return {
        ...game,
        players: rotateSeatsAntiClockwise(game.players),
        updatedAt: new Date().toISOString(),
      };
    });

    saveGames(nextGames);
    set({ games: nextGames });
  },

  togglePlayerRiichi: (gameId, playerId) => {
    const nextGames = get().games.map((game) => {
      if (game.id !== gameId) return game;

      return {
        ...game,
        players: game.players.map((player) =>
          player.id === playerId
            ? { ...player, isRiichi: !player.isRiichi }
            : player
        ),
        updatedAt: new Date().toISOString(),
      };
    });

    saveGames(nextGames);
    set({ games: nextGames });
  },

  getGameById: (gameId) => {
    return get().games.find((game) => game.id === gameId);
  },
}));