import React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import styles from "../styles/MediaCarousel.module.css";

interface MediaCarouselProps<T> {
  items: T[];
  currentIndex: number;
  loading: boolean;
  title: string;
  onPrev: () => void;
  onNext: () => void;
  renderItem: (item: T) => React.ReactNode;
  carouselType: 'movie' | 'tvShow';
  emptyMessage: string;
}

function MediaCarousel<T>({
  items,
  currentIndex,
  loading,
  title,
  onPrev,
  onNext,
  renderItem,
  carouselType,
  emptyMessage
}: MediaCarouselProps<T>) {
  if (loading) {
    return (
      <section className="mb-5">
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="light" />
          <p className="text-white">Carregando {carouselType === 'movie' ? 'filmes' : 'séries'}...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mb-5">
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className="text-center my-5">
          <p className="text-white">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-5">
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={carouselType === 'movie' ? styles.movieCarousel : styles.tvShowCarousel}>
        <Button 
          onClick={onPrev} 
          className={styles.carouselControlPrev}
          disabled={currentIndex === 0}
          aria-label="Anterior"
        >
          &lt;
        </Button>
        
        <Row className="g-4">
          {items.slice(currentIndex, currentIndex + 4).map((item, index) => (
            <Col 
              key={`${carouselType}-${index}-${currentIndex}`}
              className={carouselType === 'movie' ? styles.movieCardCol : styles.tvShowCardCol}
            >
              {renderItem(item)}
            </Col>
          ))}
        </Row>
        
        <Button 
          onClick={onNext} 
          className={styles.carouselControlNext}
          disabled={currentIndex >= items.length - 4}
          aria-label="Próximo"
        >
          &gt;
        </Button>
      </div>
    </section>
  );
}

export default MediaCarousel;