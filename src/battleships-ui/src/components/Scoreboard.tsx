import { Card, CardContent } from "@/components/ui/card";
import { calculateAccuracy, TeamStats } from "@/lib/statsUtils";

interface ScoreboardProps {
  alliesTeamStats: TeamStats;
  enemyTeamStats: TeamStats;
}

export default function Scoreboard({
  alliesTeamStats,
  enemyTeamStats,
}: ScoreboardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="text-sm font-bold underline">Your team</div>
          <div className="text-sm font-bold">Stat</div>
          <div className="text-sm font-bold">Enemy</div>

          <div className="text-sm">{alliesTeamStats.damage}</div>
          <div className="text-sm font-medium">Damage</div>
          <div className="text-sm">{enemyTeamStats.damage}</div>

          <div className="text-sm">{alliesTeamStats.hits}</div>
          <div className="text-sm font-medium">Hits</div>
          <div className="text-sm">{enemyTeamStats.hits}</div>

          <div className="text-sm">{alliesTeamStats.misses}</div>
          <div className="text-sm font-medium">Misses</div>
          <div className="text-sm">{enemyTeamStats.misses}</div>

          <div className="text-sm">{calculateAccuracy(alliesTeamStats)}</div>
          <div className="text-sm font-medium">Accuracy</div>
          <div className="text-sm">{calculateAccuracy(enemyTeamStats)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
