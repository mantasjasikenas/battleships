import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Player } from "@/models/Player";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";

interface PlayerListProps {
  players: Player[];
  activePlayer: Player;
  currentPlayer: Player;
  onGaveUp?: () => void;
  gaveUpPlayers: number[];
}

const PlayerList: React.FC<PlayerListProps> = ({
  onGaveUp,
  players,
  activePlayer,
  currentPlayer,
  gaveUpPlayers,
}) => {
  return (
    <div className="flex space-x-4">
      {[players].map((players, index) => (
        <Card key={index} className="w-60">
          <CardHeader>
            <CardTitle className="text-sm">
              <div className="flex flex-row">
                {players[0].team}

                {players[0].team === currentPlayer.team && (
                  <Badge
                    variant="destructive"
                    className="ml-auto cursor-pointer"
                    onClick={() => {
                      if (onGaveUp) {
                        onGaveUp();
                      }
                    }}
                  >
                    Give up
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span
                    className={cn(
                      "flex items-center",
                      player.id === currentPlayer.id && "font-bold underline",
                    )}
                  >
                    <span className="w-6">{player.id}</span>
                    <span>{player.name}</span>
                    {gaveUpPlayers.includes(player.id) && (
                      <Flag
                        className="ml-2"
                        color="white"
                        fill="white"
                        size={14}
                      />
                    )}
                  </span>
                  {player.id === activePlayer.id && (
                    <Badge variant="secondary" className="text-xs">
                      {player.id === currentPlayer.id ? "Your turn" : "Turn"}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlayerList;
