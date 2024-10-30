import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

export default function AdminPanel({
  actions,
}: {
  actions: { name: string; action: () => void }[];
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <Label className="font-bold">Admin Panel</Label>
      <div className="flex w-full flex-wrap justify-center gap-2">
        {actions.map(({ name, action }, index) => (
          <Button
            variant="outline"
            key={index}
            onClick={() => {
              action();
            }}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export enum AdminActions {
  DestroyAllShips,
}
