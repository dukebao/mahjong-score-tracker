"use client";

import Header from "@/components/common/Header";
import TableBoard from "@/components/game/TableBoard";
import AddRoundModal from "@/components/game/AddRoundModal";
import { useGameStore } from "@/store/useGameStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function GamePage() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();
  const [roundModalOpen, setRoundModalOpen] = useState(false);

  const {
    initialize,
    initialized,
    getGameById,
    addRound,
    undoLastRound,
    finishGame,
    rotateSeatsAntiClockwise,
    togglePlayerRiichi,
    setActiveGame,
  } = useGameStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const game = initialized ? getGameById(params.gameId) : undefined;

  const recentRounds = useMemo(() => {
    if (!game) return [];
    return [...game.rounds].reverse().slice(0, 5);
  }, [game]);

  if (!initialized) return null;

  if (!game) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Game not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-xl">
        <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
          <div className="px-4 pt-4">
            <Header
              title={game.name || "Untitled Game"}
              subtitle={`${game.ruleset} · ${game.status} · Round ${game.rounds.length + 1}`}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto pb-28">
          <section className="flex min-h-[68vh] flex-1 items-start px-4 pt-4">
            <div className="w-full">
              <TableBoard
                game={game}
                onCenterClick={() => setRoundModalOpen(true)}
                onRotateClick={() => rotateSeatsAntiClockwise(game.id)}
                onToggleRiichi={(playerId) => togglePlayerRiichi(game.id, playerId)}
              />
            </div>
          </section>

          <section className="mt-auto px-4 pt-6">
            <div className="rounded-2xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Round History</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Recent rounds only
                  </div>
                </div>
                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200">
                  {game.rounds.length} total
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {recentRounds.length === 0 ? (
                  <p className="text-sm text-slate-500">No rounds yet.</p>
                ) : (
                  recentRounds.map((round) => (
                    <div
                      key={round.id}
                      className="rounded-2xl bg-white p-3 ring-1 ring-slate-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">
                          Round {round.roundNumber}
                        </div>
                        <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          {round.type}
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 text-sm">
                        {round.adjustments.map((adj, index) => {
                          const player = game.players.find(
                            (p) => p.id === adj.playerId
                          );

                          return (
                            <div
                              key={`${round.id}-${adj.playerId}-${index}`}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="text-slate-700">
                                {player?.name ?? "Unknown"}
                              </span>
                              <span
                                className={`tabular-nums font-semibold ${
                                  adj.delta > 0
                                    ? "text-emerald-600"
                                    : adj.delta < 0
                                    ? "text-rose-600"
                                    : "text-slate-500"
                                }`}
                              >
                                {adj.delta > 0 ? "+" : ""}
                                {adj.delta}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {round.note ? (
                        <div className="mt-3 text-sm text-slate-500">
                          {round.note}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t bg-white/95 p-3 backdrop-blur">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => undoLastRound(game.id)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
            >
              Undo
            </button>

            <button
              onClick={() => setRoundModalOpen(true)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Add Round
            </button>

            <button
              onClick={() => {
                finishGame(game.id);
                router.push("/history");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
            >
              End Game
            </button>
          </div>
        </div>

        <AddRoundModal
          open={roundModalOpen}
          game={game}
          onClose={() => setRoundModalOpen(false)}
          onSubmit={(payload) => {
            addRound({
              gameId: game.id,
              ...payload,
            });
            setActiveGame(game.id);
            setRoundModalOpen(false);
          }}
        />
      </div>
    </main>
  );
}