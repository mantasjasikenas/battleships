import { Label } from "@/components/ui/label";
import MatchSettings, { GameMode } from "../../../models/MatchSettings";
import HubConnectionService, {
  MatchEventNames,
} from "../../../services/HubConnectionService/HubConnectionService";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface MatchSettingsProps {
  matchSettings: MatchSettings;
}

export default function MatchSettingsConfig(props: MatchSettingsProps) {
  const matchSettings = props.matchSettings;

  function onGameModeSelect(value: GameMode) {
    matchSettings.gameMode = value;

    onSettingsUpdate();
  }

  function onSettingsUpdate() {
    HubConnectionService.Instance.sendEvent(
      MatchEventNames.PlayerUpdatedMatchSettings,
      { matchSettings: matchSettings },
    );
  }

  return (
    <>
      <div className="mb-2 font-bold">Configure match settings</div>
      <Card className="p-4">
        <div className="flex flex-col gap-6">
          <div>
            <Label>Game mode</Label>
            <Select
              value={matchSettings.gameMode}
              onValueChange={(value) => onGameModeSelect(value as GameMode)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select gamemode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Game modes</SelectLabel>
                  {Object.values(GameMode).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </>
  );
}
