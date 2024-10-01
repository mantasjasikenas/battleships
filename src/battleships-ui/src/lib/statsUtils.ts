import { ModularShipPart } from "@/models/Ships/ShipPart";
import MatchMap, { MapTile } from "../models/MatchMap";

export class TeamStats {
  damage: number = 0;
  hits: number = 0;
  misses: number = 0;
}

export function calculateDamage(tile: MapTile): number {
  const isModularShipPart = tile.shipPart instanceof ModularShipPart;

  const initialHp = isModularShipPart
    ? (tile.shipPart as ModularShipPart).initialHp
    : 1;
  const currentHp = isModularShipPart
    ? (tile.shipPart as ModularShipPart).hp
    : tile.isShipPartDestroyed
      ? 0
      : 1;

  return Math.max(0, initialHp - currentHp);
}

export function updateTeamStats(
  currentStats: TeamStats,
  tile: MapTile,
): TeamStats {
  const damage = calculateDamage(tile);
  const isHit = tile.shipPart !== undefined && tile.isAttacked;

  return {
    damage: currentStats.damage + damage,
    hits: currentStats.hits + (isHit ? 1 : 0),
    misses: currentStats.misses + (isHit ? 0 : 1),
  };
}

export function calculateTeamStats(map: MatchMap): TeamStats {
  const stats = new TeamStats();

  for (const row of map.tiles) {
    for (const tile of row) {
      if (tile.isAttacked) {
        const isHit = tile.shipPart;
        const isMiss = !tile.shipPart;

        stats.damage += calculateDamage(tile);
        stats.hits += isHit ? 1 : 0;
        stats.misses += isMiss ? 1 : 0;
      }
    }
  }

  return stats;
}

export function calculateAccuracy(stats: TeamStats): string {
  const totalShots = stats.hits + stats.misses;
  if (totalShots === 0) return "0.0%";
  return ((stats.hits / totalShots) * 100).toFixed(1) + "%";
}
