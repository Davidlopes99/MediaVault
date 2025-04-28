import { useState } from 'react';
import { Accordion, Alert } from 'react-bootstrap';
import styles from '../styles/SobrePage.module.css'; // Importando o módulo CSS

export default function SobrePage() {
  const [showAlerta, setShowAlerta] = useState(true);

  return (
    <div className={`container ${styles.container} mt-4`}>
      

      <h2 className={`${styles.pageTitle} mb-4`}>Sobre o Projeto</h2>

      {showAlerta && (
        <Alert variant="info" onClose={() => setShowAlerta(false)} dismissible className={styles.alertInfo}>
          Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento Web.
        </Alert>
      )}

      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header className={styles.accordionHeader}>Qual o objetivo do site?</Accordion.Header>
          <Accordion.Body className={styles.accordionBody}>
            O objetivo é permitir que usuários explorem filmes e séries populares, façam buscas, filtrem por gênero e visualizem detalhes, tudo com uma interface construída em React e Bootstrap 5.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header className={styles.accordionHeader}>Como os dados são carregados?</Accordion.Header>
          <Accordion.Body className={styles.accordionBody}>
            Os dados são consumidos diretamente da API do The Movie Database (TMDb), possibilitando a exibição dinâmica de conteúdos e filtros com base em gêneros e nomes.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header className={styles.accordionHeader}>Quais tecnologias foram utilizadas?</Accordion.Header>
          <Accordion.Body className={styles.accordionBody}>
            Este projeto foi desenvolvido com React, TypeScript, React Router e Bootstrap 5. As informações são obtidas em tempo real da API pública do TMDb.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <hr className="my-5" />

      <div className={styles.contactSection}>
        <h4>Contato</h4>
        <p>📧 <strong>Email:</strong> davidvazquez@id.uff.br</p>
        <p>📞 <strong>Telefone:</strong> (21) 99123-2977</p>
      </div>
    </div>
  );
}
