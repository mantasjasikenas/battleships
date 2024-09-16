import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MatchDisplay, {
  matchLoader,
} from './components/MatchDisplay/MatchDisplay';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Toaster richColors position="top-center" duration={2000} />
    <RouterProvider router={router} />
  </React.StrictMode>
);
