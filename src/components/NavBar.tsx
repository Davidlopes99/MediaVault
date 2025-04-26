import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          NavBar
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/produtos" className="nav-link">
              Produtos
            </NavLink>
            <NavLink to="/contatos" className="nav-link">
              Contatos
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;