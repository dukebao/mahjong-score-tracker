"use client";

import Header from "@/components/common/Header";
import { RULESET_OPTIONS } from "@/lib/constants";
import { newGameSchema } from "@/lib/validators";
import { useGameStore } from "@/store/useGameStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewGamePage() {
  const router = useRouter();
  const { initialize, settings, createGame, initialized } = useGameStore();

  const [name, setName] = useState("");
  const [ruleset, setRuleset] = useState(settings.defaultRuleset);
  const [startingScore, setStartingScore] = useState(
    String(settings.defaultStartingScore)
  );
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized) {
      setRuleset(settings.defaultRuleset);
      setStartingScore(String(settings.defaultStartingScore));
    }
  }, [initialized, settings]);

  if (!initialized) return null;

  const updatePlayer = (index: number, value: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = newGameSchema.safeParse({
      name,
      ruleset,
      startingScore,
      players,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid game setup");
      return;
    }

    const gameId = createGame(result.data);
    router.push(`/game/${gameId}`);
  };

  return (
    <main className="mx-auto max-w-md p-4">
      <Header title="New Game" subtitle="Create a 4-player table" />

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Game Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border px-3 py-2"
            placeholder="Optional"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Ruleset</span>
          <select
            value={ruleset}
            onChange={(e) => setRuleset(e.target.value as typeof ruleset)}
            className="rounded-xl border px-3 py-2"
          >
            {RULESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Starting Score</span>
          <input
            type="number"
            inputMode="numeric"
            value={startingScore}
            onChange={(e) => setStartingScore(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />
        </label>

        <div className="grid gap-3">
          {players.map((player, index) => (
            <label key={index} className="grid gap-1">
              <span className="text-sm font-medium">Player {index + 1}</span>
              <input
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                className="rounded-xl border px-3 py-2"
                placeholder={`Player ${index + 1}`}
              />
            </label>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-3 font-medium text-white"
        >
          Create Game
        </button>
      </form>
    </main>
  );
}