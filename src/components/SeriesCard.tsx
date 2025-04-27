import React from 'react';
import { Card, Button } from 'react-bootstrap';
import styles from './SeriesCard.module.css';

type SeriesCardProps = {
  title: string;
  imageUrl: string;
  description: string;
  seasons: number;
  rating: number;
  onClick: () => void;
};

const SeriesCard: React.FC<SeriesCardProps> = ({
  title,
  imageUrl,
  description,
  seasons,
  rating,
  onClick
}) => {
  return (
    <Card className={styles.cardWrapper}>
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={title}
        className={styles.cardImg}
      />
      <div className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <Card.Text className={styles.cardText}>{description}</Card.Text>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.seasons}>
          <strong>Temporadas:</strong> {seasons}
        </div>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            onClick={onClick}
            className={`me-2 ${styles.detailButton}`}
          >
            Detalhes
          </Button>
          <span className={`badge ${styles.ratingBadge}`}>
            {rating.toFixed(1)} ★
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SeriesCard;
