"use client";

import {
  buildRonAdjustments,
  buildTsumoAdjustments,
  getRiichiPool,
} from "@/lib/score-utils";
import { Game, RoundAdjustment, RoundType } from "@/types/game";
import { useMemo, useState } from "react";

const QUICK_VALUES = [1000, 2000, 3900, 5200, 7700, 8000, 12000];

type AddRoundModalProps = {
  open: boolean;
  game: Game;
  onClose: () => void;
  onSubmit: (payload: {
    type: RoundType;
    adjustments: RoundAdjustment[];
    note?: string;
    riichiPoolAwarded?: number;
    winnerPlayerId?: string;
    discarderPlayerId?: string;
    enteredValue?: number;
  }) => void;
};

export default function AddRoundModal({
  open,
  game,
  onClose,
  onSubmit,
}: AddRoundModalProps) {
  const [mode, setMode] = useState<RoundType>("ron");
  const [winnerPlayerId, setWinnerPlayerId] = useState("");
  const [discarderPlayerId, setDiscarderPlayerId] = useState("");
  const [enteredValue, setEnteredValue] = useState("");
  const [note, setNote] = useState("");
  const [manualValues, setManualValues] = useState<Record<string, string>>(
    Object.fromEntries(game.players.map((p) => [p.id, "0"]))
  );
  const [manualWinnerId, setManualWinnerId] = useState("");
  const [error, setError] = useState("");

  const riichiPool = getRiichiPool(game);

  const preview = useMemo(() => {
    try {
      if (mode === "ron") {
        if (!winnerPlayerId || !discarderPlayerId || !enteredValue) return null;
        if (winnerPlayerId === discarderPlayerId) return null;

        return buildRonAdjustments(
          game,
          winnerPlayerId,
          discarderPlayerId,
          Number(enteredValue)
        );
      }

      if (mode === "tsumo") {
        if (!winnerPlayerId || !enteredValue) return null;

        return buildTsumoAdjustments(game, winnerPlayerId, Number(enteredValue));
      }

      if (mode === "manual") {
        const deltas = game.players.map((player) => ({
          playerId: player.id,
          delta: Number(manualValues[player.id] || 0),
        }));

        return deltas;
      }

      return null;
    } catch {
      return null;
    }
  }, [
    mode,
    winnerPlayerId,
    discarderPlayerId,
    enteredValue,
    manualValues,
    game,
  ]);

  if (!open) return null;

  const resetState = () => {
    setMode("ron");
    setWinnerPlayerId("");
    setDiscarderPlayerId("");
    setEnteredValue("");
    setNote("");
    setManualValues(Object.fromEntries(game.players.map((p) => [p.id, "0"])));
    setManualWinnerId("");
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleQuickValue = (value: number) => {
    setEnteredValue(String(value));
  };

  const handleManualChange = (playerId: string, value: string) => {
    setManualValues((prev) => ({ ...prev, [playerId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "ron") {
        if (!winnerPlayerId) throw new Error("Select a winner.");
        if (!discarderPlayerId) throw new Error("Select a discarder.");
        if (winnerPlayerId === discarderPlayerId) {
          throw new Error("Winner and discarder must be different.");
        }
        if (!enteredValue) throw new Error("Enter a ron value.");

        const value = Number(enteredValue);
        const adjustments = buildRonAdjustments(
          game,
          winnerPlayerId,
          discarderPlayerId,
          value
        );

        onSubmit({
          type: "ron",
          adjustments,
          note,
          riichiPoolAwarded: riichiPool,
          winnerPlayerId,
          discarderPlayerId,
          enteredValue: value,
        });

        handleClose();
        return;
      }

      if (mode === "tsumo") {
        if (!winnerPlayerId) throw new Error("Select a winner.");
        if (!enteredValue) throw new Error("Enter a tsumo value.");

        const value = Number(enteredValue);
        const adjustments = buildTsumoAdjustments(game, winnerPlayerId, value);

        onSubmit({
          type: "tsumo",
          adjustments,
          note,
          riichiPoolAwarded: riichiPool,
          winnerPlayerId,
          enteredValue: value,
        });

        handleClose();
        return;
      }

      const adjustments = game.players.map((player) => ({
        playerId: player.id,
        delta: Number(manualValues[player.id] || 0),
      }));

      const total = adjustments.reduce((sum, item) => sum + item.delta, 0);

      if (riichiPool > 0 && !manualWinnerId) {
        throw new Error("Select a winner to receive the riichi pool.");
      }

      const finalAdjustments = adjustments.map((adj) => ({
        ...adj,
        delta:
          adj.delta +
          (manualWinnerId && adj.playerId === manualWinnerId ? riichiPool : 0),
      }));

      const finalTotal = finalAdjustments.reduce((sum, item) => sum + item.delta, 0);

      if (total !== 0) {
        throw new Error("Manual adjustments must total 0 before riichi pool.");
      }

      if (riichiPool > 0 && finalTotal !== riichiPool) {
        throw new Error("Unexpected manual total after riichi pool.");
      }

      onSubmit({
        type: "manual",
        adjustments: finalAdjustments,
        note,
        riichiPoolAwarded: riichiPool,
        winnerPlayerId: manualWinnerId || undefined,
      });

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save round.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Round</h2>
          <button onClick={handleClose} className="rounded-lg border px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {(["ron", "tsumo", "manual"] as RoundType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setMode(type);
                setError("");
              }}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                mode === type ? "bg-black text-white" : "bg-white"
              }`}
            >
              {type === "ron" ? "Ron" : type === "tsumo" ? "Tsumo" : "Manual"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === "ron" || mode === "tsumo") && (
            <>
              <div>
                <div className="mb-2 text-sm font-medium">Winner</div>
                <div className="grid grid-cols-2 gap-2">
                  {game.players.map((player) => (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => setWinnerPlayerId(player.id)}
                      className={`rounded-xl border px-3 py-2 text-sm ${
                        winnerPlayerId === player.id ? "bg-black text-white" : "bg-white"
                      }`}
                    >
                      {player.name} ({player.seat})
                    </button>
                  ))}
                </div>
              </div>

              {mode === "ron" && (
                <div>
                  <div className="mb-2 text-sm font-medium">Discarder</div>
                  <div className="grid grid-cols-2 gap-2">
                    {game.players.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => setDiscarderPlayerId(player.id)}
                        className={`rounded-xl border px-3 py-2 text-sm ${
                          discarderPlayerId === player.id
                            ? "bg-black text-white"
                            : "bg-white"
                        }`}
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 text-sm font-medium">Final Value</div>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickValue(value)}
                      className={`rounded-xl border px-3 py-2 text-sm ${
                        enteredValue === String(value) ? "bg-black text-white" : "bg-white"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  inputMode="numeric"
                  value={enteredValue}
                  onChange={(e) => setEnteredValue(e.target.value)}
                  className="mt-3 w-full rounded-xl border px-3 py-2"
                  placeholder="Custom value"
                />
              </div>
            </>
          )}

          {mode === "manual" && (
            <>
              <div className="grid gap-3">
                {game.players.map((player) => (
                  <label key={player.id} className="grid gap-1">
                    <span className="text-sm font-medium">{player.name}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={manualValues[player.id]}
                      onChange={(e) => handleManualChange(player.id, e.target.value)}
                      className="rounded-xl border px-3 py-2"
                    />
                  </label>
                ))}
              </div>

              {riichiPool > 0 && (
                <div>
                  <div className="mb-2 text-sm font-medium">
                    Riichi Pool Winner ({riichiPool})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {game.players.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => setManualWinnerId(player.id)}
                        className={`rounded-xl border px-3 py-2 text-sm ${
                          manualWinnerId === player.id ? "bg-black text-white" : "bg-white"
                        }`}
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

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

          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="mb-2 text-sm font-medium">Preview</div>
            {!preview ? (
              <div className="text-sm text-slate-500">Complete the round details.</div>
            ) : (
              <div className="grid gap-1 text-sm">
                {preview.map((adj) => {
                  const player = game.players.find((p) => p.id === adj.playerId);
                  return (
                    <div key={adj.playerId} className="tabular-nums">
                      {player?.name}: {adj.delta > 0 ? "+" : ""}
                      {adj.delta}
                    </div>
                  );
                })}
                {riichiPool > 0 ? (
                  <div className="mt-2 text-xs text-slate-500">
                    Riichi pool included: {riichiPool}
                  </div>
                ) : null}
              </div>
            )}
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