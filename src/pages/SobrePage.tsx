import { useState, useEffect } from 'react';
import { Accordion, Alert, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import { FaReact, FaBootstrap, FaCode, FaServer, FaEnvelope, FaPhone, FaGithub } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import styles from '../styles/SobrePage.module.css';

export default function SobrePage() {
  const [showAlerta, setShowAlerta] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState(false);

  // Ativar animação após carregamento
  useEffect(() => {
    setActiveAnimation(true);
  }, []);

  // Tecnologias usadas no projeto
  const tecnologias = [
    { nome: "React", icone: <FaReact size={40} />, cor: "#61DAFB" },
    { nome: "TypeScript", icone: <SiTypescript size={40} />, cor: "#3178C6" },
    { nome: "Bootstrap 5", icone: <FaBootstrap size={40} />, cor: "#7952B3" },
    { nome: "API TMDb", icone: <FaServer size={40} />, cor: "#01d277" }
  ];

  return (
    <Container className={`${styles.container} mt-4 ${activeAnimation ? styles.fadeIn : ''}`}>
      <div className={styles.heroSection}>
        <h1 className={styles.pageTitle}>Sobre o Projeto</h1>
        <p className={styles.heroSubtitle}>
          Uma plataforma web para explorar o fascinante mundo dos filmes e séries
        </p>
      </div>

      {showAlerta && (
        <Alert 
          variant="info" 
          onClose={() => setShowAlerta(false)} 
          dismissible 
          className={styles.alertInfo}
        >
          <Alert.Heading>Projeto Acadêmico</Alert.Heading>
          <p>Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento Web, aplicando
          conceitos modernos de design e programação front-end.</p>
        </Alert>
      )}

      <Row className="mb-5 mt-4">
        <Col md={6} className={styles.aboutColumn}>
          <div className={styles.sectionHeading}>
            <h3><FaCode className="me-2" /> Visão Geral</h3>
          </div>
          <p className={styles.aboutText}>
            Esta plataforma foi criada para proporcionar uma experiência intuitiva de descoberta de conteúdo
            audiovisual. Nosso objetivo é trazer informações relevantes sobre filmes e séries de forma
            organizada e agradável visualmente.
          </p>
          <p className={styles.aboutText}>
            Utilizamos React com TypeScript para criar uma interface dinâmica e responsiva, consumindo
            dados em tempo real da API TMDb para garantir conteúdo sempre atualizado.
          </p>
        </Col>
        <Col md={6}>
          <Card className={styles.featureCard}>
            <Card.Body>
              <Card.Title className={styles.featureTitle}>Principais Funcionalidades</Card.Title>
              <ul className={styles.featureList}>
                <li>Exploração de filmes e séries populares</li>
                <li>Busca por nome e filtragem por gêneros</li>
                <li>Visualização detalhada de cada título</li>
                <li>Interface responsiva para todos os dispositivos</li>
                <li>Design moderno com tema escuro</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className={styles.techSection}>
        <h3 className={styles.sectionTitle}>Tecnologias Utilizadas</h3>
        <Row className="gy-4 mt-2">
          {tecnologias.map((tech, index) => (
            <Col xs={6} md={3} key={index}>
              <div className={styles.techCard} style={{ borderColor: tech.cor }}>
                <div className={styles.techIcon} style={{ color: tech.cor }}>
                  {tech.icone}
                </div>
                <h5 className={styles.techName}>{tech.nome}</h5>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className={styles.faqSection}>
        <h3 className={styles.sectionTitle}>Perguntas Frequentes</h3>
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header className={styles.accordionHeader}>
              Qual o objetivo do site?
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              O objetivo é permitir que usuários explorem filmes e séries populares, façam buscas, 
              filtrem por gênero e visualizem detalhes, tudo com uma interface construída em React 
              e Bootstrap 5. Buscamos proporcionar uma experiência intuitiva e agradável para 
              descobrir novas obras audiovisuais.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header className={styles.accordionHeader}>
              Como os dados são carregados?
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              Os dados são consumidos diretamente da API do The Movie Database (TMDb), 
              possibilitando a exibição dinâmica de conteúdos e filtros com base em gêneros e nomes.
              A cada requisição, trazemos informações atualizadas para os usuários.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header className={styles.accordionHeader}>
              Este projeto é open source?
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              Sim! O código fonte está disponível no GitHub e pode ser usado como referência 
              para outros projetos acadêmicos. Contribuições são bem-vindas através de pull requests.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header className={styles.accordionHeader}>
              Quais funcionalidades estão planejadas para o futuro?
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              Estamos planejando implementar sistema de avaliação de usuários, 
              listas personalizadas de favoritos e integração com redes sociais para 
              compartilhamento de recomendações.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <Row className="mt-5">
        <Col>
          <div className={styles.contactSection}>
            <h4><Badge bg="dark" className="mb-3">Contato do Desenvolvedor</Badge></h4>
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <p><FaEnvelope className="me-2" /> <strong>Email:</strong> davidvazquez@id.uff.br</p>
                <p><FaPhone className="me-2" /> <strong>Telefone:</strong> (21) 99123-2977</p>
              </Col>
              <Col md={6}>
                <p><FaGithub className="me-2" /> <strong>GitHub:</strong> github.com/Davidlopes99</p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <footer className={styles.footer}>
        <p>© 2025 - Projeto desenvolvido para a disciplina de Desenvolvimento Web</p>
      </footer>
    </Container>
  );
}