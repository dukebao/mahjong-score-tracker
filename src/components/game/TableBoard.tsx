import PlayerSeatCard from "@/components/game/PlayerSeatCard";
import {
  getCurrentScores,
  getPlayerByTablePosition,
  getRiichiPool,
} from "@/lib/score-utils";
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
    <div className="rounded-[28px] bg-emerald-900 p-4 text-white shadow-lg">
      <div className="mb-3 flex items-center justify-between text-xs text-emerald-100">
        <span></span>
        <button
          onClick={onRotateClick}
          aria-label="Rotate seats"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-base text-white shadow-sm transition hover:bg-white/15"
        >
          ↺
        </button>
      </div>

      <div className="relative h-[460px] w-full sm:h-[520px]">
        <div className="absolute left-1/2 top-3 -translate-x-1/2">
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

        <div className="absolute left-0 top-1/2 -translate-y-1/2">
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

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
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

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
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

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
          <button
            onClick={onCenterClick}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-dashed border-white/40 bg-black/15 text-center shadow-inner transition hover:bg-black/20"
          >
            <span className="text-3xl leading-none">＋</span>
            <span className="mt-1 text-[10px] font-medium leading-tight text-emerald-50">
              Add Round
            </span>
          </button>

          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold shadow-sm">
            Riichi Pool: {riichiPool}
          </div>
        </div>
      </div>
    </div>
  );
}