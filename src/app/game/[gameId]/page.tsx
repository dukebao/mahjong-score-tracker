"use client";

import Header from "@/components/common/Header";
import TableBoard from "@/components/game/TableBoard";
import { useGameStore } from "@/store/useGameStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddRoundModal from "@/components/game/AddRoundModal";

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

    if (!initialized) return null;

    const game = getGameById(params.gameId);

    if (!game) {
        return (
            <main className="mx-auto max-w-md p-4">
                <p>Game not found.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-md p-4">
            <Header
                title={game.name || "Untitled Game"}
                subtitle={`${game.ruleset} · ${game.status} · Round ${game.rounds.length + 1}`}
            />

            <TableBoard
                game={game}
                onCenterClick={() => setRoundModalOpen(true)}
                onRotateClick={() => rotateSeatsAntiClockwise(game.id)}
                onToggleRiichi={(playerId) => togglePlayerRiichi(game.id, playerId)}
            />

            <div className="mt-6 grid gap-3">
                <button
                    onClick={() => undoLastRound(game.id)}
                    className="rounded-xl border px-4 py-3"
                >
                    Undo Last Round
                </button>

                <button
                    onClick={() => {
                        finishGame(game.id);
                        router.push("/history");
                    }}
                    className="rounded-xl border px-4 py-3"
                >
                    End Game
                </button>
            </div>

            <section className="mt-8">
                <h2 className="mb-3 text-lg font-semibold">Round History</h2>
                <div className="grid gap-3">
                    {game.rounds.length === 0 ? (
                        <p className="text-sm text-slate-500">No rounds yet.</p>
                    ) : (
                        [...game.rounds].reverse().map((round) => (
                            <div key={round.id} className="rounded-xl border p-3">
                                <div className="font-medium">Round {round.roundNumber}</div>
                                <div className="mt-2 text-sm">
                                    {round.adjustments.map((adj, index) => {
                                        const player = game.players.find((p) => p.id === adj.playerId);
                                        return (
                                            <div key={`${round.id}-${adj.playerId}-${index}`} className="tabular-nums">
                                                {player?.name}: {adj.delta > 0 ? "+" : ""}
                                                {adj.delta}
                                            </div>
                                        );
                                    })}
                                </div>
                                {round.note ? (
                                    <div className="mt-2 text-sm text-slate-500">{round.note}</div>
                                ) : null}
                            </div>
                        ))
                    )}
                </div>
            </section>

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
                }}
            />
        </main>
    );
}