import { useState } from 'react';
import { Accordion, Modal, Button, Offcanvas, Alert, Breadcrumb } from 'react-bootstrap';

export default function SobrePage() {
  const [showModal, setShowModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showAlerta, setShowAlerta] = useState(true);

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item active>Sobre</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="mb-4">Sobre o Projeto</h2>

      {showAlerta && (
        <Alert variant="info" onClose={() => setShowAlerta(false)} dismissible>
          Este projeto foi desenvolvido trabalho da matéria de desenvolvimento web.
        </Alert>
      )}

      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Qual o objetivo do site?</Accordion.Header>
          <Accordion.Body>
            O objetivo é listar, avaliar e interagir com filmes e séries, usando React e Bootstrap 5.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Como os dados são carregados?</Accordion.Header>
          <Accordion.Body>
            Atualmente, os dados são simulados localmente no código, mas podem ser conectados a uma API futuramente.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mb-4">
        <Button variant="dark" className="me-2" onClick={() => setShowModal(true)}>
          Contato
        </Button>
        <Button variant="secondary" onClick={() => setShowCanvas(true)}>
          Abrir menu lateral
        </Button>
      </div>

      {/* Modal de Contato */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Email: exemplo@email.com</p>
          <p>Telefone: (21) 99999-0000</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Offcanvas */}
      <Offcanvas show={showCanvas} onHide={() => setShowCanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mais opções</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Aqui você podem ser adicionados atalhos, links úteis, ou configurações.
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
