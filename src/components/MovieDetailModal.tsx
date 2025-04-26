import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Movie } from "../types"; // Ajuste o caminho do arquivo de tipos

type MovieDetailModalProps = {
  show: boolean;
  movie: Movie | null;
  onHide: () => void;
};

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ show, movie, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{movie?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={movie?.title}
              className="img-fluid rounded"
            />
          </Col>
          <Col md={8}>
            <p>
              <strong>Sinopse completa:</strong> {movie?.overview}
            </p>
            <p>
              <strong>Data de lançamento:</strong> {movie?.release_date}
            </p>
            <p>
              <strong>Gêneros:</strong>{" "}
              {movie?.genres?.length ? movie?.genres?.map((g) => g.name).join(", ") : "Sem gêneros disponíveis"}
            </p>
            <p>
              <strong>Avaliação média:</strong> {movie?.vote_average.toFixed(1)} ★
            </p>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MovieDetailModal;
