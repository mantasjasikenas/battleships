import { Outlet } from "react-router-dom";
import CommandInput from "../../components/CommandInput/CommandInput";
import LoggerConfig from "../../components/LoggerConfig/LoggerConfig";
import { MessageDisplay } from "../../components/MessageDisplay/MessageDisplay";

export default function Root() {
  return (
      <div className="h-screen w-screen">
        <div className="hidden">
          <LoggerConfig />
        </div>
        <div className="flex w-full items-center justify-center p-6">
          <Outlet />
        </div>
        <div className="hidden">
          <CommandInput />
          <MessageDisplay />
        </div>
      </div>
  );
}
