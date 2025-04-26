import { Outlet, Link } from 'react-router-dom';
import Footer from '../components/Footer';


export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="/">MediaVault</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Início</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/filmes">Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/series">Séries</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sobre">Sobre</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container flex-grow-1 mt-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
