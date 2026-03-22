"use client";

import Header from "@/components/common/Header";
import { getCurrentScores } from "@/lib/score-utils";
import { useGameStore } from "@/store/useGameStore";
import Link from "next/link";
import { useEffect } from "react";

export default function HistoryPage() {
  const { initialize, initialized, games, deleteGame } = useGameStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) return null;

  return (
    <main className="mx-auto max-w-md p-4">
      <Header title="History" subtitle="Saved and finished games" />

      <div className="grid gap-3">
        {games.length === 0 ? (
          <p className="text-sm text-slate-500">No games yet.</p>
        ) : (
          games.map((game) => {
            const scores = getCurrentScores(game);

            const leader = game.players
              .map((player) => ({
                ...player,
                score: scores[player.id] ?? game.startingScore,
              }))
              .sort((a, b) => b.score - a.score)[0];

            return (
              <div key={game.id} className="rounded-2xl border p-4">
                <Link href={`/game/${game.id}`} className="block">
                  <div className="font-semibold">{game.name || "Untitled Game"}</div>
                  <div className="text-sm text-slate-500">
                    {game.ruleset} · {game.status}
                  </div>
                  {leader ? (
                    <div className="mt-2 text-sm">
                      Leader: {leader.name} ({leader.score})
                    </div>
                  ) : null}
                </Link>

                <button
                  onClick={() => deleteGame(game.id)}
                  className="mt-3 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}