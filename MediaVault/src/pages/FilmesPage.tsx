import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';


const movies = [
  {
    title: "O Poderoso Chefão",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYTRmMjkwYzYtYTRiMi00NDJjLTk1NjctMDA3MjY2ZWIyMGQ5XkEyXkFqcGc@._V1_.jpg",
    description: "A história de Don Vito Corleone, o chefe de uma das famílias mafiosas mais poderosas.",
    rating: 9.2,
  },
  {
    title: "A Origem",
    imageUrl: "https://upload.wikimedia.org/wikipedia/pt/8/84/AOrigemPoster.jpg",
    description: "Dom Cobb é um ladrão especializado em extrair segredos valiosos através do uso de tecnologia que permite invadir os sonhos das pessoas.",
    rating: 8.8,
  },
  {
    title: "Matrix",
    imageUrl: "https://upload.wikimedia.org/wikipedia/pt/c/c1/The_Matrix_Poster.jpg",
    description: "Um hacker é recrutado por um misterioso grupo que luta contra uma realidade simulada controlada por máquinas.",
    rating: 8.7,
  },
];

const FilmesPage: React.FC = () => {
  const handleMovieClick = (movieTitle: string) => {
    alert(`Você clicou no filme: ${movieTitle}`);
  };

  return (
    <div>
      <h1>Filmes</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie, index) => (
          <Col key={index}>
            <MovieCard
              title={movie.title}
              imageUrl={movie.imageUrl}
              description={movie.description}
              rating={movie.rating}
              onClick={() => handleMovieClick(movie.title)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilmesPage;
