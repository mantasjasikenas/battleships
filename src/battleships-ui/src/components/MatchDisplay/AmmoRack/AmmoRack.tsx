import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Ammo } from '../../../models/Ammo';
import MatchProvider from '../../../services/MatchProvider/MatchProvider';

interface AmmoRackProps {
  onAmmoSelect: (ammo: Ammo) => void;
}

export default function AmmoRack({ onAmmoSelect }: AmmoRackProps) {
  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null);

  const match = MatchProvider.Instance.match;

  return (
    <div className="w-100 d-flex justify-content-center mt-3">
      {match.availableAmmoTypes.map((ammo, index) => (
        <Button
          variant={selectedAmmo === ammo ? 'primary' : 'outline-primary'}
          key={index}
          onClick={() => {
            onAmmoSelect(ammo);
            setSelectedAmmo(ammo);
          }}
        >
          {ammo.name}
        </Button>
      ))}
    </div>
  );
}
