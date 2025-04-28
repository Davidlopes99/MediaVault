import React, { useEffect } from "react";
import { Modal, Row, Col, Accordion } from "react-bootstrap";
import { Series, Episode } from "C:/Users/david/Documents/GitHub/MediaVault/src/types"; // Defina seus tipos em um arquivo separado
import styles from "./SeriesDetailModal.module.css"; // Importe o CSS do modal

type TVShowDetailModalProps = {
  show: boolean;
  tvShow: Series | null;
  onHide: () => void;
  fetchEpisodes: (seasonNumber: number, tvShowId: number) => void;
  episodesBySeason: Record<number, Episode[]>;
};

const TVShowDetailModal: React.FC<TVShowDetailModalProps> = ({
  show,
  tvShow,
  onHide,
  fetchEpisodes,
  episodesBySeason,
}) => {
  useEffect(() => {
    if (tvShow) {
      // Quando a série for selecionada, buscamos as temporadas
      for (let i = 1; i <= tvShow.number_of_seasons; i++) {
        fetchEpisodes(i, tvShow.id);
      }
    }
  }, [tvShow, fetchEpisodes]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName={styles.modalContent}>
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>{tvShow?.name}</Modal.Title>
        <button className={styles.customCloseButton} onClick={onHide}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow?.poster_path}`}
              alt={tvShow?.name}
              className={`${styles.modalPoster} img-fluid`}
            />
          </Col>
          <Col md={8}>
            <p className={styles.modalDescription}>
              <strong>Sinopse:</strong> {tvShow?.overview}
            </p>
            <p className={styles.modalDescription}>
              <strong>Temporadas:</strong> {tvShow?.number_of_seasons}
            </p>
            <p className={styles.modalRating}>
              <strong>Classificação:</strong> {tvShow?.vote_average.toFixed(1)} ★
            </p>

            <Accordion>
              {[...Array(tvShow?.number_of_seasons)].map((_, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>Temporada {index + 1}</Accordion.Header>
                  <Accordion.Body>
                    {episodesBySeason[index + 1] && (
                      <ul>
                        {episodesBySeason[index + 1].map((episode) => (
                          <li key={episode.episode_number}>
                            <strong>{episode.name}</strong>
                            <p>{episode.overview}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TVShowDetailModal;
