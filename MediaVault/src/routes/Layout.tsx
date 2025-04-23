import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="/">MediaVault</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/produtos">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contatos">Contatos</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
}
