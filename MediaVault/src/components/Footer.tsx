export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <div className="container">
        <p className="mb-2">&copy; {new Date().getFullYear()} MediaVault. Todos os direitos reservados.</p>
        
        <div className="mb-2">
          <a href="https://github.com/Davidlopes99" target="_blank" rel="noopener noreferrer" className="text-white me-3">
            <i className="fab fa-github fa-lg"></i>
          </a>
          <a href="www.linkedin.com/in/david-lopes-de-santana-vazquez-669a5b2ab" target="_blank" rel="noopener noreferrer" className="text-white me-3">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
        </div>

        <p className="small mb-0">Desenvolvido com React + Bootstrap</p>


      </div>
    </footer>
  );
}
