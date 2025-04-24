import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Button, Form, Modal, Accordion } from 'react-bootstrap';
import SeriesCard from '../components/SeriesCard';

import '../styles/SeriesPage.css';

type Series = {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  number_of_seasons: number;
};

type Genre = {
  id: number;
  name: string;
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
};

const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, Episode[]>>({});

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const fetchGenres = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=pt-BR`);
      const data = await res.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Erro ao buscar gêneros de séries:", error);
    }
  };

  const fetchSeriesDetails = async (seriesList: any[]) => {
    const detailedSeries = await Promise.all(
      seriesList.map(async (s) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/tv/${s.id}?api_key=${API_KEY}&language=pt-BR`
          );
          const details = await res.json();
          return {
            ...s,
            number_of_seasons: details.number_of_seasons,
            vote_average: details.vote_average,
            overview: details.overview,
          };
        } catch {
          return { ...s, number_of_seasons: 0, vote_average: s.vote_average };
        }
      })
    );
    setSeries(detailedSeries);
  };

  const fetchSeries = async (pageNumber: number, sortParam: string) => {
    setLoading(true);
    const baseUrl = searchTerm
      ? `https://api.themoviedb.org/3/search/tv`
      : `https://api.themoviedb.org/3/discover/tv`;
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
    const queryParam = searchTerm ? `&query=${encodeURIComponent(searchTerm)}` : '';
    const sortParamUsed = searchTerm ? '' : `&sort_by=${sortParam}`;
    try {
      const response = await fetch(
        `${baseUrl}?api_key=${API_KEY}&language=pt-BR&page=${pageNumber}${sortParamUsed}${genreParam}${queryParam}`
      );
      const data = await response.json();
      await fetchSeriesDetails(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async (seasonNumber: number) => {
    if (!selectedSeries) return;
    if (episodesBySeason[seasonNumber]) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${selectedSeries.id}/season/${seasonNumber}?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setEpisodesBySeason((prev) => ({ ...prev, [seasonNumber]: data.episodes }));
    } catch (error) {
      console.error(`Erro ao buscar episódios da temporada ${seasonNumber}:`, error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchSeries(page, sortBy);
  }, [page, sortBy, selectedGenre, searchTerm]);

  const handleSeriesClick = (serie: Series) => {
    setSelectedSeries(serie);
    setEpisodesBySeason({});
  };

  const handleCloseModal = () => setSelectedSeries(null);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Séries</h2>

      <Form className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="sortSelect">
              <Form.Label>Ordenar por:</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popularity.desc">Mais populares</option>
                <option value="popularity.asc">Menos populares</option>
                <option value="vote_average.desc">Mais bem avaliadas</option>
                <option value="vote_average.asc">Piores avaliadas</option>
                <option value="first_air_date.desc">Mais recentes</option>
                <option value="first_air_date.asc">Mais antigas</option>
                <option value="original_name.asc">Título A-Z</option>
                <option value="original_name.desc">Título Z-A</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="genreSelect">
              <Form.Label>Filtrar por Gênero:</Form.Label>
              <Form.Select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Todos</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="searchInput">
              <Form.Label>Buscar por Nome:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da série"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p>Carregando séries...</p>
        </div>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {series.map((s) => (
              <Col key={s.id}>
                <SeriesCard
                  title={s.name}
                  imageUrl={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
                  description={s.overview}
                  seasons={s.number_of_seasons}
                  rating={s.vote_average}
                  onClick={() => handleSeriesClick(s)}
                />
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Página Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button variant="primary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Próxima Página
            </Button>
          </div>
        </>
      )}

      <Modal show={!!selectedSeries} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedSeries?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedSeries?.poster_path}`} 
                alt={selectedSeries?.name}
                className="img-fluid"
              />
            </Col>
            <Col md={8}>
              <p><strong>Sinopse:</strong> {selectedSeries?.overview}</p>
              <p><strong>Temporadas:</strong> {selectedSeries?.number_of_seasons}</p>
              <p><strong>Avaliação:</strong> {selectedSeries?.vote_average.toFixed(1)} ★</p>

              <h5 className="mt-4">Episódios por Temporada</h5>
              <Accordion>
                {Array.from({ length: selectedSeries?.number_of_seasons || 0 }, (_, i) => i + 1).map((num) => (
                  <Accordion.Item eventKey={String(num)} key={num}>
                    <Accordion.Header onClick={() => fetchEpisodes(num)}>
                      Temporada {num}
                    </Accordion.Header>
                    <Accordion.Body>
                      {episodesBySeason[num] ? (
                        episodesBySeason[num].map((ep) => (
                          <div key={ep.episode_number} className="mb-3">
                            <strong>{ep.episode_number}. {ep.name}</strong>
                            <p>{ep.overview}</p>
                          </div>
                        ))
                      ) : (
                        <Spinner animation="border" size="sm" />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SeriesPage;