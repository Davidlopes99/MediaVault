import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import styles from '../styles/Layout.module.css';

export default function Layout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <Link className={styles.navbarBrand} to="/">
            <span className={styles.brandIcon}>📺</span>
            <span className={styles.brandText}>MediaVault</span>
          </Link>
          
          <button 
            className={`${styles.navbarToggler} ${menuOpen ? styles.open : ''}`} 
            type="button" 
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className={styles.togglerIcon}></span>
            <span className={styles.togglerIcon}></span>
            <span className={styles.togglerIcon}></span>
          </button>
          
          <div className={`${styles.navbarCollapse} ${menuOpen ? styles.show : ''}`}>
            <ul className={styles.navbarNav}>
              {[
                { name: 'Início', path: '/' },
                { name: 'Filmes', path: '/filmes' },
                { name: 'Séries', path: '/series' },
                { name: 'Sobre', path: '/sobre' }
              ].map((item, index) => (
                <li className={styles.navItem} key={index}>
                  <Link 
                    className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`} 
                    to={item.path}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className={styles.navItem}>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container-fluid flex-grow-1 px-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}