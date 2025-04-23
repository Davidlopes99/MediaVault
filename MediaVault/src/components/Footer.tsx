export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <div className="container">
        <p className="mb-2">&copy; {new Date().getFullYear()} MediaVault. Todos os direitos reservados.</p>
        
        <div className="mb-2">
          <a href="https://github.com/seu-usuario" target="_blank" rel="noopener noreferrer" className="text-white me-3">
            <i className="fab fa-github fa-lg"></i>
          </a>
          <a href="https://linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" className="text-white me-3">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
          <a href="mailto:seu@email.com" className="text-white">
            <i className="fas fa-envelope fa-lg"></i>
          </a>
        </div>

        <p className="small mb-0">Feito com <i className="fas fa-heart text-danger"></i> usando React + Bootstrap</p>
      </div>
    </footer>
  );
}
