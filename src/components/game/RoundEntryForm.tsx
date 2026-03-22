"use client";

import { roundEntrySchema } from "@/lib/validators";
import { z } from "zod";
import { useState } from "react";

type PlayerInput = {
  playerId: string;
  playerName: string;
};

type RoundEntryFormProps = {
  players: PlayerInput[];
  onSubmit: (payload: { adjustments: { playerId: string; delta: number }[]; note?: string }) => void;
};

export default function RoundEntryForm({
  players,
  onSubmit,
}: RoundEntryFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(players.map((p) => [p.playerId, "0"]))
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleChange = (playerId: string, value: string) => {
    setValues((prev) => ({ ...prev, [playerId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const adjustments = players.map((player) => ({
      playerId: player.playerId,
      delta: Number(values[player.playerId] || 0),
    }));

    const result = roundEntrySchema.safeParse({
      adjustments,
      note,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      setError(firstIssue?.message || "Invalid round entry");
      return;
    }

    setError("");
    onSubmit(result.data);

    setValues(Object.fromEntries(players.map((p) => [p.playerId, "0"])));
    setNote("");
  };

  const total = players.reduce(
    (sum, player) => sum + Number(values[player.playerId] || 0),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-4">
      <div>
        <h2 className="text-lg font-semibold">Add Round</h2>
        <p className="text-sm text-muted-foreground">
          Enter each player’s point change. Total must equal 0.
        </p>
      </div>

      <div className="grid gap-3">
        {players.map((player) => (
          <label key={player.playerId} className="grid gap-1">
            <span className="text-sm font-medium">{player.playerName}</span>
            <input
              type="number"
              inputMode="numeric"
              value={values[player.playerId]}
              onChange={(e) => handleChange(player.playerId, e.target.value)}
              className="rounded-xl border px-3 py-2"
            />
          </label>
        ))}
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Note</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-xl border px-3 py-2"
          placeholder="Optional"
        />
      </label>

      <div className="text-sm">
        Total: <span className="font-semibold tabular-nums">{total}</span>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-black px-4 py-3 text-white"
      >
        Save Round
      </button>
    </form>
  );
}