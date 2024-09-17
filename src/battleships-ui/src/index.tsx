import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MatchDisplay from './components/MatchDisplay/MatchDisplay';
import { matchLoader } from './services/MatchService/match-loader';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NewMatch from './components/NewMatch/NewMatch';
import Root from './routes/Root/Root';
import Pregame from './components/MatchDisplay/Pregame/Pregame';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <NewMatch />,
      },
      {
        path: 'match',
        children: [
          {
            path: '',
            element: <MatchDisplay />,
            loader: matchLoader,
          },
          {
            path: 'pregame',
            element: <Pregame />,
            loader: matchLoader,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position="top-center" duration={2000} />
    <RouterProvider router={router} />
  </StrictMode>
);
