import { CommandInputDialog } from "@/components/CommandInputDialog";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="h-screen w-screen">
      <div className="flex w-full items-center justify-center p-6">
        <Outlet />
      </div>
      <CommandInputDialog />
    </div>
  );
}
