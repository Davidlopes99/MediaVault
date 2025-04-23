// src/components/SeriesCard.tsx
import { Card, Button, Badge } from 'react-bootstrap';

export type SeriesCardProps = {
  title: string;
  imageUrl: string;
  description: string;
  seasons: number;
  onClick: () => void;
};

export default function SeriesCard({
  title,
  imageUrl,
  description,
  seasons,
  onClick
}: SeriesCardProps) {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={imageUrl} alt={title} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text className="flex-grow-1">{description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Badge bg="info">{seasons} {seasons > 1 ? 'Temporadas' : 'Temporada'}</Badge>
          <Button variant="primary" size="sm" onClick={onClick}>
            Detalhes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
