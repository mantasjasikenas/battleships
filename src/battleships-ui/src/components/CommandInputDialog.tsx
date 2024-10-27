import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Interpreter } from "@/services/CommandInterpreter/Interpreter/Interpreter";

export function CommandInputDialog() {
  const interpreter = new Interpreter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleButtonPress = (e: any) => {
    if (e.key === "Enter") {
      interpreter.interpret(e.target.value);
      setOpen(false);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        onKeyDown={handleButtonPress}
      />
      <CommandList />
    </CommandDialog>
  );
}
