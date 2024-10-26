import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { MapTile } from "../../../models/MatchMap";
import { PlayerTeam } from "../../../models/Player";
import HubConnectionService, {
  MatchEventNames,
} from "../../../services/HubConnectionService/HubConnectionService";
import MatchProvider from "../../../services/MatchProvider/MatchProvider";
import MapGrid from "../MapGrid/MapGrid";
import { toast } from "sonner";
import { PlayerService } from "../../../services/PlayerService/PlayerService";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { TileColor } from "@/models/Map/TileColors";
import { ShipFactoryCreator } from "@/services/MatchService/ShipFactory";
import { PlaceShipCommand } from "@/models/command";

export default function ShipPlacement() {
  const navigate = useNavigate();
  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);

  const [selectedAlignment, setSelectedAlignment] = useState(0);

  const match = MatchProvider.Instance.match;

  const shipsFactory = ShipFactoryCreator.getShipFactory(
    match.settings.gameMode,
  );

  const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
  const currentPlayer = match.players.find(
    (player) => player.id === currentPlayerId,
  )!;

  currentPlayer.ships = shipsFactory.createShips();

  const currentPlayerTeam = currentPlayer.team;

  const alliesTeamMap = match.teamsMap.get(currentPlayerTeam)!;

  useEffect(() => {
    HubConnectionService.Instance.addSingular(
      MatchEventNames.ShipsPlaced,
      placeShip,
    );
  }, []);
  useEffect(() => {
    HubConnectionService.Instance.addSingular(
      MatchEventNames.UndoCommand,
      Undo,
    );
  }, []);

  const renderLegend = () => {
    const legendItems = [
      { color: TileColor.Selected, text: "Selected" },
      { color: TileColor.Ship, text: "Your Ships" },
    ];

    return (
      <div className="mt-4 flex flex-wrap items-center justify-center space-x-4 text-zinc-300">
        {legendItems.map((item) => (
          <div className="flex items-center" key={item.text}>
            <div className={cn("mr-2 h-4 w-4", item.color)}></div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-screen">
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-center text-3xl font-bold">
          {match.name}
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-8 pt-4">
          <div className="flex flex-col items-start justify-end gap-6">
            <MapGrid
              isEnemyMap={false}
              map={alliesTeamMap}
              title="Your map"
              selectedTile={selectedTile}
              onTileSelect={onOwnTileSelect}
            />
          </div>
        </div>

        {renderLegend()}

        <div className="mt-8 flex flex-col items-center gap-2">
          <Label className="font-bold">Ship alignment</Label>
          <div className="flex w-full flex-wrap justify-center gap-2">
            <Button
              variant={selectedAlignment === 0 ? "default" : "outline"}
              onClick={() => {
                setSelectedAlignment(0);
              }}
            >
              Horizontally
            </Button>
            <Button
              variant={selectedAlignment === 1 ? "default" : "outline"}
              onClick={() => {
                setSelectedAlignment(1);
              }}
            >
              Vertically
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <Button disabled={!selectedTile} onClick={() => onPlace()}>Place</Button>
          <Button onClick={() => onRandom()}>Place randomly</Button>
          <Button onClick={() => HubConnectionService.Instance.sendEvent(MatchEventNames.UndoCommand, {userId: currentPlayerId})}>Undo</Button>
        </div>
      </div>
    </div>
  );

  function onOwnTileSelect(tile: MapTile): void {
    setSelectedTile(tile);
  }

  function onRandom(): void {
    let validNr = currentPlayer.placedShips;

    for (let i = 0; i < 100; i++) {
      if (validNr >= currentPlayer.ships.length) {
        rerender();
        toast.success("All ships placed");
        return;
      }

      let coversShip = false;

      let x = Math.floor(Math.random() * (alliesTeamMap.tiles.length - 0)) + 0;
      let y =
        Math.floor(Math.random() * (alliesTeamMap.tiles[0].length - 0)) + 0;

      let a = Math.floor(Math.random() * (2 - 0)) + 0;

      if (a === 0) {
        if (
          currentPlayer.ships[validNr].parts.length + y >
          alliesTeamMap.tiles[0].length
        ) {
          continue;
        }

        for (let i = 0; i < currentPlayer.ships[validNr].parts.length; i++) {
          if (alliesTeamMap.tiles[x][y + i].shipPart !== undefined) {
            coversShip = true;
            break;
          }
        }

        if (coversShip) {
          continue;
        }

        currentPlayer.ships[validNr].parts.forEach((part, partIndex) => {
          alliesTeamMap.tiles[x][y + partIndex].shipPart = part;
        });
      } else {
        if (
          currentPlayer.ships[validNr].parts.length + x >
          alliesTeamMap.tiles.length
        ) {
          continue;
        }

        for (let i = 0; i < currentPlayer.ships[validNr].parts.length; i++) {
          if (alliesTeamMap.tiles[x + i][y].shipPart !== undefined) {
            coversShip = true;
            break;
          }
        }

        if (coversShip) {
          continue;
        }

        currentPlayer.ships[validNr].parts.forEach((part, partIndex) => {
          alliesTeamMap.tiles[x + partIndex][y].shipPart = part;
        });
      }

      validNr++;

      
      HubConnectionService.Instance.sendEvent(MatchEventNames.ShipsPlaced, {
        placerId: currentPlayer.id,
        placerTeam: currentPlayer.team,
        tile: new MapTile(x, y),
        alignment: a,
        ships: currentPlayer.ships,
      });
    }

    toast.error("All ships could not be placed");

    return;
  }

  function onPlace(): void {
    setSelectedTile(null);
    if (!selectedTile) {
      toast.error("Select tile to place first!");
    } else if (alliesTeamMap.shipsPlaced === true) {
      toast.error("All ships have been placed, please wait for enemy team!");
    } else {
      if (selectedAlignment === 0) {
        if (
          currentPlayer.ships[currentPlayer.placedShips].parts.length +
            selectedTile.y >
          alliesTeamMap.tiles[0].length
        ) {
          toast.error("Can't place ship out of bounds!");
          return;
        }
        for (
          let i = 0;
          i < currentPlayer.ships[currentPlayer.placedShips].parts.length;
          i++
        ) {
          if (
            alliesTeamMap.tiles[selectedTile.x][selectedTile.y + i].shipPart !==
            undefined
          ) {
            toast.error("Can't place on other ships!");
            return;
          }
        }
      } else {
        if (
          currentPlayer.ships[currentPlayer.placedShips].parts.length +
            selectedTile.x >
          alliesTeamMap.tiles.length
        ) {
          toast.error("Can't place ship out of bounds!");
          return;
        }
        for (
          let i = 0;
          i < currentPlayer.ships[currentPlayer.placedShips].parts.length;
          i++
        ) {
          if (
            alliesTeamMap.tiles[selectedTile.x + i][selectedTile.y].shipPart !==
            undefined
          ) {
            toast.error("Can't place on other ships!");
            return;
          }
        }
      }
      
      HubConnectionService.Instance.sendEvent(MatchEventNames.ShipsPlaced, {
        placerId: currentPlayer.id,
        placerTeam: currentPlayer.team,
        tile: selectedTile,
        alignment: selectedAlignment,
        ships: currentPlayer.ships,
      });
      rerender();
    }
    return;
  }

  function placeShip(data: any): void {
    const { placerId, placerTeam, tile, alignment, ships } = data;

    const placer = match.players.find((player) => player.id === placerId)!;

    const currentMap = match.teamsMap.get(placerTeam)!;

    const otherTeam =
      placerTeam === PlayerTeam.FirstTeam
        ? PlayerTeam.SecondTeam
        : PlayerTeam.FirstTeam;

    const otherMap = match.teamsMap.get(otherTeam);
    placer.invoker.execute(new PlaceShipCommand(placerId, placerTeam, tile, alignment, ships));

    if (placer.placedShips >= ships.length && otherMap?.shipsPlaced === true) {
      navigate("/match/");
    } 

    rerender();
  }

  function Undo(data: any){
    const { userId } = data; 
    const user = match.players.find((player) => player.id === userId)!;
    user.invoker.undo();
    rerender();
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }
}
