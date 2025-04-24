import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Button, Modal } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import Sidebar from '../components/Sidebar';

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
};

const FilmesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const [providers, setProviders] = useState<{ provider_id: number; provider_name: string }[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [classification, setClassification] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch genres and watch providers on mount
  useEffect(() => {
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

    const fetchProviders = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&language=pt-BR&watch_region=BR`
        );
        const data = await res.json();
        setProviders(data.results || []);
      } catch (err) {
        console.error('Erro ao buscar provedores:', err);
      }
    };

    fetchGenres();
    fetchProviders();
  }, []);

  // Fetch movies whenever filters/page change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const base = searchTerm
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/discover/movie';
    
      const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
      const providerParam = selectedProvider
        ? `&with_watch_providers=${selectedProvider}&watch_region=BR`
        : '';
      const certParam = classification ? `&certification_country=BR&certification=${classification}` : '';
      const queryParam = searchTerm ? `&query=${encodeURIComponent(searchTerm)}` : '';
      const sortParam = (sortBy !== 'title.asc' && sortBy !== 'title.desc' && !searchTerm)
        ? `&sort_by=${sortBy}` : '';
    
      try {
        let allResults: Movie[] = [];
        let currentPage = 1;
        let totalPagesFetched = sortBy === 'title.asc' || sortBy === 'title.desc' ? 5 : 1; // limite de 5 páginas se ordenando localmente
    
        do {
          const res = await fetch(
            `${base}?api_key=${API_KEY}&language=pt-BR&page=${currentPage}${sortParam}${genreParam}${providerParam}${certParam}${queryParam}`
          );
          const data = await res.json();
          allResults = [...allResults, ...data.results];
          currentPage++;
          if (sortBy !== 'title.asc' && sortBy !== 'title.desc') {
            setTotalPages(data.total_pages);
            break;
          }
        } while (currentPage <= totalPagesFetched);
    
        if (sortBy === 'title.asc') {
          allResults.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title.desc') {
          allResults.sort((a, b) => b.title.localeCompare(a.title));
        }
    
        setMovies(allResults);
        if (sortBy === 'title.asc' || sortBy === 'title.desc') {
          setTotalPages(1); // Força uma página só
          setPage(1);
        }
    
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchMovies();
  }, [page, sortBy, selectedGenre, selectedProvider, classification, searchTerm]);
  

  const handleCardClick = (id: number) => {
    // fetch details and open modal
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`
        );
        const details = await res.json();
        setSelectedMovie(details);
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
      }
    };
    fetchDetails();
  };

  const handleClose = () => setSelectedMovie(null);

  return (
    <div className="container mt-4">
      <h1>Filmes</h1>
      <Row>
        <Col md={3}>
          <Sidebar
            sortBy={sortBy}
            setSortBy={value => { setSortBy(value); setPage(1); }}
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={value => { setSelectedGenre(value); setPage(1); }}
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={value => { setSelectedProvider(value); setPage(1); }}
            searchTerm={searchTerm}
            setSearchTerm={value => { setSearchTerm(value); setPage(1); }}
            classification={classification}
            setClassification={value => { setClassification(value); setPage(1); }}
          />
        </Col>
        <Col md={9}>
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
        </Col>
      </Row>

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
