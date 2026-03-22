import { z } from "zod";

export const newGameSchema = z.object({
  name: z.string().optional(),
  ruleset: z.enum(["riichi", "hong-kong", "taiwanese", "manual"]),
  startingScore: z.coerce.number().int().positive(),
  players: z
    .array(z.string().trim().min(1, "Player name is required"))
    .length(4, "Exactly 4 players are required")
    .refine(
      (players) => new Set(players.map((p) => p.toLowerCase())).size === players.length,
      "Player names must be unique"
    ),
});

export const roundEntrySchema = z.object({
  adjustments: z
    .array(
      z.object({
        playerId: z.string().min(1),
        delta: z.coerce.number().int(),
      })
    )
    .length(4)
    .refine(
      (adjustments) =>
        adjustments.reduce((sum, item) => sum + item.delta, 0) === 0,
      "Round total must equal 0"
    ),
  note: z.string().optional(),
});