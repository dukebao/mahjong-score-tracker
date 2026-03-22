"use client";

import { roundEntrySchema } from "@/lib/validators";
import { useState } from "react";

type PlayerInput = {
  playerId: string;
  playerName: string;
};

type RoundEntryModalProps = {
  open: boolean;
  players: PlayerInput[];
  onClose: () => void;
  onSubmit: (payload: {
    adjustments: { playerId: string; delta: number }[];
    note?: string;
  }) => void;
};

export default function RoundEntryModal({
  open,
  players,
  onClose,
  onSubmit,
}: RoundEntryModalProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(players.map((p) => [p.playerId, "0"]))
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

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
      setError(result.error.issues[0]?.message || "Invalid round entry");
      return;
    }

    setError("");
    onSubmit(result.data);
    setValues(Object.fromEntries(players.map((p) => [p.playerId, "0"])));
    setNote("");
    onClose();
  };

  const total = players.reduce(
    (sum, player) => sum + Number(values[player.playerId] || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Round</h2>
          <button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </div>
  );
}