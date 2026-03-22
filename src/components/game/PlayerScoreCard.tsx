type PlayerScoreCardProps = {
  name: string;
  seat: string;
  score: number;
  rank?: number;
};

export default function PlayerScoreCard({
  name,
  seat,
  score,
  rank,
}: PlayerScoreCardProps) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {seat}
          </div>
          <div className="text-lg font-semibold">{name}</div>
        </div>
        {rank ? (
          <div className="rounded-full border px-2 py-1 text-xs font-medium">
            #{rank}
          </div>
        ) : null}
      </div>
      <div className="mt-4 text-3xl font-bold tabular-nums">{score}</div>
    </div>
  );
}