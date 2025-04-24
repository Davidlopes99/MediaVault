import React from 'react';
import { Card, Button } from 'react-bootstrap';

type MovieCardProps = {
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  onClick: () => void;
};

const MovieCard: React.FC<MovieCardProps> = ({ title, imageUrl, description, rating, onClick }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={imageUrl} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary" onClick={onClick}>Detalhes</Button>
          <div className="badge bg-warning text-dark">{rating.toFixed(1)} ★</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
