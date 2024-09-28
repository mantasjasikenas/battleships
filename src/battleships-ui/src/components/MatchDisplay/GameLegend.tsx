import { cn } from "@/lib/utils";
import { TileColor } from "@/models/Map/TileColors";

function GameLegend() {
  const legendItems = [
    { color: TileColor.Selected, text: "Selected" },
    { color: TileColor.Ship, text: "Your Ships" },
    { color: TileColor.Miss, text: "Miss" },
    { color: TileColor.Destroyed, text: "Destroyed" },
    { color: TileColor.Damaged, text: "Hit" },
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
}

export default GameLegend;
