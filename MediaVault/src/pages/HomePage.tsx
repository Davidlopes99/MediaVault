import { useEffect, useState } from 'react';
import { Modal, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';

// Tipos para filmes e séries
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

type Series = {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
};

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch popular movies and series on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`)
        ]);
        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();
        setMovies(moviesData.results);
        setSeries(seriesData.results);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p>Carregando conteúdos...</p>
      </div>
    );
  }

  const carouselItems = movies.slice(0, 3);
  const cardMovies = movies.slice(3, 9);
  const featuredSeries = series.slice(0, 6);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Em Alta</h2>
      <div id="carouselFilmes" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded">
          {carouselItems.map((m, idx) => (
            <div
              key={m.id}
              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
              onClick={() => handleOpen(m)}
              role="button"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                className="d-block w-100"
                alt={m.title}
                style={{ maxHeight: '350px', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselFilmes" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselFilmes" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <h2 className="mb-3">Filmes em Destaque</h2>
      <Row xs={1} sm={2} md={3} lg={3} className="g-4 mb-5">
        {cardMovies.map(m => (
          <Col key={m.id}>
            <MovieCard
              title={m.title}
              imageUrl={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              description={m.overview}
              rating={Number(m.vote_average.toFixed(1))}
              onClick={() => handleOpen(m)}
            />
          </Col>
        ))}
      </Row>

      <h2 className="mb-3">Séries em Destaque</h2>
      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {featuredSeries.map(s => (
          <Col key={s.id}>
            <SeriesCard
              title={s.name}
              imageUrl={`https://image.tmdb.org/t/p/w300${s.poster_path}`}
              description=""
              seasons={0}
              rating={Number(s.vote_average.toFixed(1))}
              onClick={() => {}}
            />
          </Col>
        ))}
      </Row>

      {/* Modal de Detalhes do Filme */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`}
                alt={selectedMovie?.title}
                className="img-fluid rounded"
              />
            </Col>
            <Col md={8}>
              <p><strong>Sinopse completa:</strong> {selectedMovie?.overview}</p>
              <p><strong>Data de lançamento:</strong> {selectedMovie?.release_date}</p>
              <p><strong>Avaliação média:</strong> {selectedMovie?.vote_average.toFixed(1)} ★</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}