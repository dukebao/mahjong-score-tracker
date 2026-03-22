"use client";

import Header from "@/components/common/Header";
import { useGameStore } from "@/store/useGameStore";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const { initialize, initialized, games, activeGameId } = useGameStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) return null;

  const activeGame = games.find((game) => game.id === activeGameId);
  const recentGames = games.slice(0, 5);

  return (
    <main className="mx-auto max-w-md p-4">
      <Header
        title="Mahjong Score Tracker"
        subtitle="Riichi-first, manual score entry"
      />

      <div className="grid gap-3">
        {activeGame ? (
          <Link
            href={`/game/${activeGame.id}`}
            className="rounded-2xl border p-4 shadow-sm"
          >
            <div className="text-sm text-muted-foreground">Resume active game</div>
            <div className="mt-1 font-semibold">
              {activeGame.name || "Untitled Game"}
            </div>
          </Link>
        ) : null}

        <Link
          href="/new-game"
          className="rounded-2xl bg-black p-4 text-center font-medium text-white"
        >
          New Game
        </Link>

        <Link href="/history" className="rounded-2xl border p-4 shadow-sm">
          History
        </Link>

        <Link href="/settings" className="rounded-2xl border p-4 shadow-sm">
          Settings
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Recent Games</h2>
        <div className="grid gap-2">
          {recentGames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No games yet.</p>
          ) : (
            recentGames.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="rounded-xl border p-3"
              >
                <div className="font-medium">{game.name || "Untitled Game"}</div>
                <div className="text-sm text-muted-foreground">
                  {game.ruleset} · {game.status}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}