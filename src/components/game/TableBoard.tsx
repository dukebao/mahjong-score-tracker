import PlayerSeatCard from "@/components/game/PlayerSeatCard";
import { getCurrentScores, getPlayerByTablePosition, getRiichiPool } from "@/lib/score-utils";
import { Game } from "@/types/game";

type TableBoardProps = {
  game: Game;
  onCenterClick: () => void;
  onRotateClick: () => void;
  onToggleRiichi: (playerId: string) => void;
};

export default function TableBoard({
  game,
  onCenterClick,
  onRotateClick,
  onToggleRiichi,
}: TableBoardProps) {
  const scores = getCurrentScores(game);
  const riichiPool = getRiichiPool(game);

  const topPlayer = getPlayerByTablePosition(game, "top");
  const leftPlayer = getPlayerByTablePosition(game, "left");
  const bottomPlayer = getPlayerByTablePosition(game, "bottom");
  const rightPlayer = getPlayerByTablePosition(game, "right");

  return (
    <div className="relative mx-auto mt-6 h-[480px] w-full max-w-md rounded-[2rem] border bg-slate-50 p-4">
      <button
        onClick={onRotateClick}
        aria-label="Rotate seats"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg shadow-sm"
      >
        ↺
      </button>

      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        {topPlayer && (
          <PlayerSeatCard
            playerId={topPlayer.id}
            name={topPlayer.name}
            seat={topPlayer.seat}
            score={scores[topPlayer.id]}
            position="top"
            isRiichi={topPlayer.isRiichi}
            onToggleRiichi={onToggleRiichi}
          />
        )}
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {leftPlayer && (
          <PlayerSeatCard
            playerId={leftPlayer.id}
            name={leftPlayer.name}
            seat={leftPlayer.seat}
            score={scores[leftPlayer.id]}
            position="left"
            isRiichi={leftPlayer.isRiichi}
            onToggleRiichi={onToggleRiichi}
          />
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        {bottomPlayer && (
          <PlayerSeatCard
            playerId={bottomPlayer.id}
            name={bottomPlayer.name}
            seat={bottomPlayer.seat}
            score={scores[bottomPlayer.id]}
            position="bottom"
            isRiichi={bottomPlayer.isRiichi}
            onToggleRiichi={onToggleRiichi}
          />
        )}
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {rightPlayer && (
          <PlayerSeatCard
            playerId={rightPlayer.id}
            name={rightPlayer.name}
            seat={rightPlayer.seat}
            score={scores[rightPlayer.id]}
            position="right"
            isRiichi={rightPlayer.isRiichi}
            onToggleRiichi={onToggleRiichi}
          />
        )}
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <button
          onClick={onCenterClick}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-center text-sm font-semibold text-white shadow-lg"
        >
          Add
          <br />
          Round
        </button>

        <div className="rounded-full border bg-white px-3 py-1 text-xs font-semibold shadow-sm">
          Riichi Pool: {riichiPool}
        </div>
      </div>
    </div>
  );
}