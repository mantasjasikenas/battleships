"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect } from "react";

export function CommandInputDialog() {
  const [open, setOpen] = React.useState(false);

  // replace this with your own commands (command objects)
  const commands = [
    {
      label: "Place ships",
      command: "place-ships",
    },
    {
      label: "Example command",
      command: "example-command",
    },
  ];

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

  const handleSelect = (command: string) => {
    console.log(`Selected command: ${command}`);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Commands">
          {commands.map((command) => (
            <CommandItem
              key={command.command}
              onSelect={() => handleSelect(command.command)}
            >
              <span>{command.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
