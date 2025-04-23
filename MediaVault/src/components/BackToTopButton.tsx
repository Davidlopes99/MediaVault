import { useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow ${visible ? 'd-block' : 'd-none'}`}
      style={{ zIndex: 1000 }}
      aria-label="Voltar ao topo"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}
