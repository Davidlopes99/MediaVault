import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Movie } from "../types"; // Ajuste o caminho do arquivo de tipos
import styles from "C:/Users/david/Documents/GitHub/MediaVault/src/components/MovieDetailModal.module.css"; // Importe o CSS

type MovieDetailModalProps = {
  show: boolean;
  movie: Movie | null;
  onHide: () => void;
};

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ show, movie, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      animation={true}
      contentClassName={styles.modalContent} // Aplica a classe CSS diretamente no modal
    >
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>{movie?.title}</Modal.Title>
        <button className={styles.customCloseButton} onClick={onHide}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={movie?.title}
              className={`${styles.modalPoster} img-fluid rounded`}
            />
          </Col>
          <Col md={8}>
            <p className={styles.modalDescription}>
              <strong>Sinopse completa:</strong> {movie?.overview}
            </p>
            <p>
              <strong>Data de lançamento:</strong> {movie?.release_date}
            </p>
            <p>
              <strong>Gêneros:</strong>{" "}
              {movie?.genres?.length
                ? movie?.genres?.map((g) => g.name).join(", ")
                : "Sem gêneros disponíveis"}
            </p>
            <p>
              <strong>Avaliação média:</strong> {movie?.vote_average.toFixed(1)} ★
            </p>
            
            {/* Adicionando a seção de Streamings */}
            {movie?.streamingPlatforms && movie.streamingPlatforms.length > 0 ? (
              <p>
                <strong>Disponível em:</strong>{" "}
                {movie.streamingPlatforms.join(", ")}
              </p>
            ) : (
              <p><strong>Não disponível em plataformas de streaming.</strong></p>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MovieDetailModal;
