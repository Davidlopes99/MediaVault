import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import styles from './SeriesCard.module.css';
import { Calendar, Star, Tv } from 'lucide-react';
import { Series } from '../types'; // Ajuste o caminho conforme necessário

interface SeriesCardProps {
  series: Series;
  onClick: () => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  onClick
}) => {
  const { name, poster_path, overview, number_of_seasons, vote_average, first_air_date } = series;
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format rating to one decimal place
  const formattedRating = vote_average ? (vote_average / 2).toFixed(1) : "N/A"; // Dividindo por 2 se a escala for 0-10
  
  // Get rating color class
  const getRatingColorClass = () => {
    if (!vote_average) return styles.ratingNA;
    const normalizedRating = vote_average / 2; // Se a escala for 0-10
    if (normalizedRating >= 4) return styles.ratingHigh;
    if (normalizedRating >= 3) return styles.ratingMedium;
    return styles.ratingLow;
  };
  
  // Format release date
  const formatReleaseDate = () => {
    if (!first_air_date) return "Data desconhecida";
    
    try {
      const date = new Date(first_air_date);
      return new Intl.DateTimeFormat('pt-BR', { 
        year: 'numeric', 
        month: 'short'
      }).format(date);
    } catch (error) {
      return "Data inválida";
    }
  };

  // Prepare image URL
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "";

  return (
    <Card 
      className={`${styles.seriesCard} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.imageContainer}>
        {imageError || !poster_path ? (
          <div className={styles.fallbackImage}>
            <span>Sem imagem</span>
          </div>
        ) : (
          <Card.Img 
            variant="top" 
            src={imageUrl} 
            alt={`Poster de ${name}`}
            className={styles.cardImage}
            onError={() => setImageError(true)}
          />
        )}
        
        <div className={`${styles.overlay} ${isHovered ? styles.visible : ''}`}>
          <div className={styles.overlayContent}>
            <h3 className={styles.overlayTitle}>{name}</h3>
            <p className={styles.overlayDescription}>
              {overview ? (overview.length > 120 
                ? `${overview.substring(0, 120)}...` 
                : overview) : "Sem descrição disponível"}
            </p>
            <button className={styles.detailsButton}>Ver detalhes</button>
          </div>
        </div>
        
        <Badge className={`${styles.ratingBadge} ${getRatingColorClass()}`}>
          <Star size={14} className={styles.ratingIcon} />
          {formattedRating}
        </Badge>
        
        <Badge className={styles.seasonsBadge}>
          <Tv size={14} className={styles.seasonsIcon} />
          {number_of_seasons} {number_of_seasons === 1 ? 'Temporada' : 'Temporadas'}
        </Badge>
      </div>
      
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{name}</Card.Title>
        <div className={styles.cardMeta}>
          <span className={styles.releaseDate}>
            <Calendar size={14} className={styles.calendarIcon} />
            {formatReleaseDate()}
          </span>
          <span className={styles.seasons}>
            <Tv size={14} className={styles.tvIcon} />
            {number_of_seasons} {number_of_seasons === 1 ? 'Temp.' : 'Temps.'}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SeriesCard;