type PlayerSeatCardProps = {
  playerId: string;
  name: string;
  seat: string;
  score: number;
  position: "top" | "left" | "bottom" | "right";
  isRiichi: boolean;
  onToggleRiichi: (playerId: string) => void;
};

export default function PlayerSeatCard({
  playerId,
  name,
  seat,
  score,
  position,
  isRiichi,
  onToggleRiichi,
}: PlayerSeatCardProps) {
  const rotationClass =
    position === "left"
      ? "-rotate-90"
      : position === "right"
      ? "rotate-90"
      : "";

  const seatStyle =
    seat.toLowerCase() === "east"
      ? "bg-blue-900 text-white border-blue-950"
      : "bg-white text-slate-900 border-slate-200";

  const labelStyle =
    seat.toLowerCase() === "east" ? "text-blue-100" : "text-slate-500";

  return (
    <div
      className={`relative flex min-h-[104px] min-w-[128px] items-center justify-center rounded-2xl border px-3 py-4 shadow-sm ${rotationClass} ${seatStyle}`}
    >
      <button
        type="button"
        onClick={() => onToggleRiichi(playerId)}
        className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
          isRiichi
            ? "border-red-700 bg-red-600 text-white"
            : "border-slate-300 bg-white/80 text-slate-700"
        }`}
        aria-label={`Toggle riichi for ${name}`}
        title="Riichi"
      >
        立
      </button>

      <div className="text-center">
        <div className={`text-xs uppercase tracking-wide ${labelStyle}`}>{seat}</div>
        <div className="mt-1 text-lg font-semibold">{name}</div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{score}</div>
        {isRiichi ? (
          <div className="mt-2 text-xs font-semibold tracking-wide text-red-500">
            RIICHI
          </div>
        ) : null}
      </div>
    </div>
  );
}