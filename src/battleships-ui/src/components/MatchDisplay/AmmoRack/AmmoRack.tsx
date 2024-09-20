import { Button } from "@/components/ui/button";
import { Ammo } from "../../../models/Ammo";
import MatchProvider from "../../../services/MatchProvider/MatchProvider";
import { Label } from "@radix-ui/react-label";

interface AmmoRackProps {
  selectedAmmo: Ammo | null;
  onAmmoSelect: (ammo: Ammo) => void;
}

export default function AmmoRack({
  selectedAmmo,
  onAmmoSelect,
}: AmmoRackProps) {
  const match = MatchProvider.Instance.match;

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <Label className="font-bold">Ammo types</Label>
      <div className="flex w-full flex-wrap justify-center gap-2">
        {match.availableAmmoTypes.map((ammo, index) => (
          <Button
            variant={selectedAmmo === ammo ? "default" : "outline"}
            key={index}
            onClick={() => {
              onAmmoSelect(ammo);
            }}
          >
            {ammo.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
