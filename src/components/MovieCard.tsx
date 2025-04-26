import { Card, Button } from "react-bootstrap";
import styles from "./MovieCard.module.css";

type Props = {
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  onClick: () => void;
};

export default function MovieCard({ title, imageUrl, description, rating, onClick }: Props) {
  return (
    <Card className={styles.cardWrapper}>
      <Card.Img variant="top" src={imageUrl} className="card-img-top" />
      <div className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <Card.Text className={styles.cardText}>{description}</Card.Text>
      </div>
      <div className={styles.cardFooter}>
        <Button onClick={onClick}>Detalhes</Button>
        <span className="badge bg-warning text-dark">{rating.toFixed(1)} ★</span>
      </div>
    </Card>
  );
}
