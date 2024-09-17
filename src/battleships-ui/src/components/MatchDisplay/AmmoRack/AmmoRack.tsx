import { Button } from 'react-bootstrap';
import { Ammo } from '../../../models/Ammo';
import MatchProvider from '../../../services/MatchProvider/MatchProvider';

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
    <div className="w-100 d-flex justify-content-center mt-3 gap-2">
      {match.availableAmmoTypes.map((ammo, index) => (
        <Button
          variant={selectedAmmo === ammo ? 'primary' : 'outline-primary'}
          key={index}
          onClick={() => {
            onAmmoSelect(ammo);
          }}
        >
          {ammo.name}
        </Button>
      ))}
    </div>
  );
}
