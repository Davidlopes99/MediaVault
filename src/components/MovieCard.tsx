import React, { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import styles from "./MovieCard.module.css";
import { Calendar, Star } from 'lucide-react';

interface MovieCardProps {
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  releaseDate?: string;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  imageUrl,
  description,
  rating,
  releaseDate,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format rating to one decimal place
  const formattedRating = rating ? rating.toFixed(1) : "N/A";
  
  // Get rating color class
  const getRatingColorClass = () => {
    if (!rating) return styles.ratingNA;
    if (rating >= 8) return styles.ratingHigh;
    if (rating >= 6) return styles.ratingMedium;
    return styles.ratingLow;
  };
  
  // Format release date
  const formatReleaseDate = () => {
    if (!releaseDate) return "Data desconhecida";
    
    try {
      const date = new Date(releaseDate);
      return new Intl.DateTimeFormat('pt-BR', { 
        year: 'numeric', 
        month: 'short'
      }).format(date);
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <Card 
      className={`${styles.movieCard} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.imageContainer}>
        {imageError ? (
          <div className={styles.fallbackImage}>
            <span>Sem imagem</span>
          </div>
        ) : (
          <Card.Img 
            variant="top" 
            src={imageUrl} 
            alt={`Poster de ${title}`}
            className={styles.cardImage}
            onError={() => setImageError(true)}
          />
        )}
        
        <div className={`${styles.overlay} ${isHovered ? styles.visible : ''}`}>
          <div className={styles.overlayContent}>
            <h3 className={styles.overlayTitle}>{title}</h3>
            <p className={styles.overlayDescription}>
              {description.length > 120 
                ? `${description.substring(0, 120)}...` 
                : description || "Sem descrição disponível"}
            </p>
            <button className={styles.detailsButton}>Ver detalhes</button>
          </div>
        </div>
        
        <Badge className={`${styles.ratingBadge} ${getRatingColorClass()}`}>
          <Star size={14} className={styles.ratingIcon} />
          {formattedRating}
        </Badge>
      </div>
      
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <div className={styles.cardMeta}>
          <span className={styles.releaseDate}>
            <Calendar size={14} className={styles.calendarIcon} />
            {formatReleaseDate()}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;