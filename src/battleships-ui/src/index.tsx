import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import MatchDisplay from "./components/MatchDisplay/MatchDisplay";
import { matchLoader } from "./services/MatchService/match-loader";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewMatch from "./components/NewMatch/NewMatch";
import Root from "./routes/Root/Root";
import Pregame from "./components/MatchDisplay/Pregame/Pregame";
import ShipPlacement from "./components/MatchDisplay/ShipPlacement/ShipPlacement.tsx"
import { Toaster } from "sonner";
import ErrorPage from "./routes/Error";
import { ThemeProvider } from "./components/theme-provider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <NewMatch />,
      },
      {
        path: "match",
        children: [
          {
            path: "",
            element: <MatchDisplay />,
            loader: matchLoader,
          },
          {
            path: "pregame",
            element: <Pregame />,
            loader: matchLoader,
          },
          {
            path: "ShipPlacement",
            element: <ShipPlacement />,
            loader: matchLoader,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors position="top-center" duration={2000} />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
