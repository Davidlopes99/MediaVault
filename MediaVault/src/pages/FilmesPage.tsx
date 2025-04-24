import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Button, Form, Modal } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';


type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
};

type Genre = {
  id: number;
  name: string;
};

const FilmesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setGenres(data.genres);
    } catch (err) {
      console.error('Erro ao buscar gêneros:', err);
    }
  };

  const fetchMovies = async (pageNum: number, sortParam: string) => {
    setLoading(true);
    const base = searchTerm
      ? 'https://api.themoviedb.org/3/search/movie'
      : 'https://api.themoviedb.org/3/discover/movie';
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
    const queryParam = searchTerm ? `&query=${encodeURIComponent(searchTerm)}` : '';
    const sortParamUsed = searchTerm ? '' : `&sort_by=${sortParam}`;

    try {
      const response = await fetch(
        `${base}?api_key=${API_KEY}&language=pt-BR&page=${pageNum}${sortParamUsed}${genreParam}${queryParam}`
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Erro ao buscar filmes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
      );
      const details = await res.json();
      setSelectedMovie(details);
    } catch (err) {
      console.error('Erro ao buscar detalhes do filme:', err);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies(page, sortBy);
  }, [page, sortBy, selectedGenre, searchTerm]);

  const handleCardClick = (id: number) => {
    fetchMovieDetails(id);
  };

  const handleClose = () => setSelectedMovie(null);

  return (
    <div className="container mt-4">
      <h1>Filmes</h1>

      <Form className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="sortSelect">
              <Form.Label>Ordenar por:</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                <option value="popularity.desc">Mais populares</option>
                <option value="popularity.asc">Menos populares</option>
                <option value="vote_average.desc">Mais bem avaliados</option>
                <option value="vote_average.asc">Piores avaliados</option>
                <option value="release_date.desc">Mais recentes</option>
                <option value="release_date.asc">Mais antigos</option>
                <option value="original_title.asc">Título A-Z</option>
                <option value="original_title.desc">Título Z-A</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="genreSelect">
              <Form.Label>Filtrar por Gênero:</Form.Label>
              <Form.Select value={selectedGenre} onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}>
                <option value="">Todos</option>
                {genres.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="searchInput">
              <Form.Label>Buscar por Nome:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do filme"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p>Carregando filmes...</p>
        </div>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {movies.map(m => (
              <Col key={m.id}>
                <MovieCard
                  title={m.title}
                  imageUrl={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  description={m.overview}
                  rating={m.vote_average}
                  onClick={() => handleCardClick(m.id)}
                />
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Página Anterior
            </Button>
            <span>Página {page} de {totalPages}</span>
            <Button variant="primary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Próxima Página
            </Button>
          </div>
        </>
      )}

      <Modal show={!!selectedMovie} onHide={handleClose} size="lg" centered>
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
              <p><strong>Gêneros:</strong> {selectedMovie?.genres.map(g => g.name).join(', ')}</p>
              <p><strong>Avaliação média:</strong> {selectedMovie?.vote_average.toFixed(1)} ★</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FilmesPage;
