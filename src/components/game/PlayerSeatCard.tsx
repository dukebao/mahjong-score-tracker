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
  isRiichi,
  onToggleRiichi,
}: PlayerSeatCardProps) {
  const isEast = seat.toLowerCase() === "east";

  const seatLabelMap: Record<string, string> = {
    east: "東",
    south: "南",
    west: "西",
    north: "北",
  };

  const cardStyle = isEast
    ? "bg-[#1E3A8A] text-white"
    : "bg-white text-slate-900";

  const seatLabelStyle = isEast ? "text-blue-100" : "text-slate-500";

  const riichiBadgeStyle = isRiichi
    ? "bg-red-500 text-white"
    : isEast
      ? "bg-white/15 text-white"
      : "bg-slate-100 text-slate-400";

  const riichiTextStyle = isRiichi
    ? "text-red-500"
    : isEast
      ? "text-white/35"
      : "text-slate-300";

  return (
    <div
      className={`relative flex h-[112px] w-[110px] flex-col justify-between rounded-2xl p-3 shadow-sm ${cardStyle}`}
    >
      <button
        type="button"
        onClick={() => onToggleRiichi(playerId)}
        className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${riichiBadgeStyle}`}
        aria-label={`Toggle riichi for ${name}`}
        title="Riichi"
      >
        立
      </button>

      <div className="text-center">
        <div
          className={`text-[10px] font-semibold tracking-wide ${seatLabelStyle}`}
        >
          {seatLabelMap[seat.toLowerCase()] ?? seat}
        </div>

        <div className="mt-1 truncate text-xl font-bold leading-none">
          {name}
        </div>

        <div className="mt-5 text-[20px] font-bold leading-none tracking-tight tabular-nums">
          {score}
        </div>
      </div>

      <div
        className={`text-center text-xs font-bold tracking-wide ${riichiTextStyle}`}
      >
        RIICHI
      </div>
    </div>
  );
}