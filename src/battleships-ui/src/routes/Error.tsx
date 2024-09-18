import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">
          We're sorry, but an unexpected error has occurred. Please try again
          later or contact support if the issue persists.
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
