import { generatePath, useNavigate } from "react-router-dom";
import HubConnectionService, {
  MatchEventNames,
} from "../../services/HubConnectionService/HubConnectionService";
import { PlayerService } from "../../services/PlayerService/PlayerService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function NewMatch() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const playerName = data.username;

    const player = PlayerService.createNew(playerName);

    PlayerService.saveToSessionStorage(player);

    HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerJoined, {
      player: player,
    });

    HubConnectionService.Instance.sendEvent(MatchEventNames.NewMatch);

    const path = generatePath("match/pregame");

    navigate(path, { replace: true });
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <div className="h-4 pt-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-center pt-2">
            <Button type="submit">Join a match!</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
