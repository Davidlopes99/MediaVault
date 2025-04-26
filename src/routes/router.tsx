import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../pages/HomePage';
import FilmesPage from '../pages/FilmesPage';
import SeriesPage from '../pages/SeriesPage';
import SobrePage from '../pages/SobrePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'filmes', element: <FilmesPage /> },
      { path: 'series', element: <SeriesPage /> },
      { path: 'sobre', element: <SobrePage /> }
    ]
  }
]);

export default router;
