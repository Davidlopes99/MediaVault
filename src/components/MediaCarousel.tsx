import React, { useState, useEffect } from "react";
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
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  
  // Responsively adjust items per page based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setItemsPerPage(1);
      } else if (width < 768) {
        setItemsPerPage(2);
      } else if (width < 992) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  
  const handleCarouselNav = (direction: 'prev' | 'next') => {
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    // Add a small delay to allow animation to complete
    setTimeout(() => {
      if (direction === 'prev') {
        onPrev();
      } else {
        onNext();
      }
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return (
      <section className="mb-5">
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={`${styles.loadingContainer} text-center py-5`}>
          <Spinner animation="border" role="status" variant="warning" className={styles.spinner} />
          <p className={styles.loadingText}>Carregando {carouselType === 'movie' ? 'filmes' : 'séries'}...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mb-5">
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={`${styles.emptyContainer} text-center py-4`}>
          <div className={styles.emptyIcon}>🎬</div>
          <p className={styles.emptyText}>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  const canGoNext = currentIndex < items.length - itemsPerPage;
  const canGoPrev = currentIndex > 0;
  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className={`${styles.carouselSection} mb-5`}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.itemCounter}>
          <span className={styles.currentItems}>{currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, items.length)}</span>
          <span className={styles.totalItems}> de {items.length}</span>
        </div>
      </div>
      
      <div className={carouselType === 'movie' ? styles.movieCarousel : styles.tvShowCarousel}>
        <Button 
          onClick={() => handleCarouselNav('prev')} 
          className={`${styles.carouselControlPrev} ${!canGoPrev ? styles.disabled : ''}`}
          disabled={!canGoPrev || isAnimating}
          aria-label="Anterior"
        >
          <span aria-hidden="true">&lt;</span>
        </Button>
        
        <div className={styles.carouselContent}>
          <Row 
            className={`${styles.carouselRow} g-4 ${isAnimating ? styles.animating : ''} ${animationDirection === 'next' ? styles.slideNext : styles.slidePrev}`}
          >
            {visibleItems.map((item, index) => (
              <Col 
                key={`${carouselType}-${index}-${currentIndex}`}
                className={carouselType === 'movie' ? styles.movieCardCol : styles.tvShowCardCol}
                xs={12} 
                sm={6} 
                md={4} 
                lg={12 / itemsPerPage}
              >
                {renderItem(item)}
              </Col>
            ))}
          </Row>
        </div>
        
        <Button 
          onClick={() => handleCarouselNav('next')} 
          className={`${styles.carouselControlNext} ${!canGoNext ? styles.disabled : ''}`}
          disabled={!canGoNext || isAnimating}
          aria-label="Próximo"
        >
          <span aria-hidden="true">&gt;</span>
        </Button>
      </div>
      
      <div className={styles.carouselDots}>
        {Array.from({ length: Math.ceil(items.length / itemsPerPage) }).map((_, i) => {
          const startIdx = i * itemsPerPage;
          const isActive = currentIndex >= startIdx && currentIndex < startIdx + itemsPerPage;
          
          return (
            <button 
              key={`dot-${i}`}
              className={`${styles.carouselDot} ${isActive ? styles.active : ''}`}
              aria-label={`Página ${i + 1}`}
              onClick={() => {
                setAnimationDirection(startIdx > currentIndex ? 'next' : 'prev');
                setIsAnimating(true);
                setTimeout(() => {
                  // Use the hook function to set the new index directly
                  // This assumes the setter functions can handle direct value assignment
                  if (carouselType === 'movie') {
                    if (title.includes('Netflix')) {
                      setCurrentNetflixMovieIndex(startIdx);
                    } else {
                      setCurrentMovieIndex(startIdx);
                    }
                  } else {
                    if (title.includes('Netflix')) {
                      setCurrentNetflixSeriesIndex(startIdx);
                    } else {
                      setCurrentStreamingSeriesIndex(startIdx);
                    }
                  }
                  setIsAnimating(false);
                }, 300);
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

export default MediaCarousel;