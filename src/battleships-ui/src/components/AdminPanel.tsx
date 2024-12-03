import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";

export default function ActionsPanel({
  actions,
  message,
  onMessageClear,
}: {
  actions: { name: string; action: () => void }[];
  message: string | undefined;
  onMessageClear: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <Label className="font-bold">Actions</Label>

      {message && (
        <div className="grid w-full max-w-[550px] gap-1.5 pb-1.5">
          <Textarea
            className="h-[300px] resize-none"
            value={message}
            readOnly
            id="message-2"
          />
          <Button onClick={onMessageClear}>Clear output</Button>
        </div>
      )}

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
