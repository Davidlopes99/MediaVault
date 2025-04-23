import { useState } from 'react';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const renderTooltip = (rating: number) => (
    <Tooltip>Nota {rating}/5</Tooltip>
  );

  return (
    <div className="container mt-4">
      {/* Carousel */}
      <div id="carouselFilmes" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded">
          <div className="carousel-item active">
            <img src="/assets/imagens/filme1.jpg" className="d-block w-100" alt="Filme 1" />
          </div>
          <div className="carousel-item">
            <img src="/assets/imagens/filme2.jpg" className="d-block w-100" alt="Filme 2" />
          </div>
          <div className="carousel-item">
            <img src="/assets/imagens/filme3.jpg" className="d-block w-100" alt="Filme 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselFilmes" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselFilmes" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Cards de Lançamentos */}
      <h2 className="mb-3">Filmes em destaque</h2>
      <div className="row g-4">
        {[1, 2, 3].map((item) => (
          <div className="col-md-4" key={item}>
            <div className="card h-100 shadow-sm">
              <img src={`/assets/imagens/filme${item}.jpg`} className="card-img-top" alt={`Filme ${item}`} />
              <div className="card-body">
                <h5 className="card-title">Filme {item}</h5>
                <p className="card-text">Um filme incrível para você assistir.</p>
                <OverlayTrigger placement="top" overlay={renderTooltip(4)}>
                  <span className="text-warning">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                </OverlayTrigger>
              </div>
              <div className="card-footer text-end">
                <Button variant="primary" size="sm" onClick={handleOpen}>
                  Ver mais
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Filme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Aqui vão os detalhes mais completos sobre o filme selecionado.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
