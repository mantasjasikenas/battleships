import { Button } from "@/components/ui/button";
import ErrorPage from "@/routes/Error";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  winningTeam: string | null;
}

export default function GameOver() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | undefined;

  if (!state) {
    return <ErrorPage />;
  }

  const { winningTeam } = state;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Game Over!
        </h1>
        <p className="mt-4 text-muted-foreground">
          {winningTeam ? `The ${winningTeam} team won!` : "It's a draw!"}
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate("/", { replace: true })}>
            Go back home
          </Button>
        </div>
      </div>
    </div>
  );
}
