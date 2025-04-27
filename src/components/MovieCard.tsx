import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './MovieCard.module.css';

type MovieCardProps = {
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  onClick: () => void;
};

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  imageUrl,
  description,
  rating,
  onClick
}) => {
  return (
    <Card className={styles.cardWrapper}>
      <Card.Img variant="top" src={imageUrl} alt={title} />
      <div className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <Card.Text className={styles.cardText}>{description}</Card.Text>
      </div>
      <div className={styles.cardFooter}>
        <button onClick={onClick} className={styles.detailButton}>
          Detalhes
        </button>
        <span className={styles.ratingBadge}>
          {rating.toFixed(1)} ★
        </span>
      </div>
    </Card>
  );
};

export default MovieCard;
