import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/SidebarFilmes";
import styles from "../styles/FilmesPage.module.css";
import MovieDetailModal from "../components/MovieDetailModal";

// Definições de tipos
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
};

type Provider = { provider_id: number; provider_name: string };
type Genre = { id: number; name: string };
type Country = { iso_3166_1: string; english_name: string };

const FilmesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de filtro
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [classification, setClassification] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Busca gêneros, provedores e países na montagem
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
        );
        const data = await res.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Erro ao buscar gêneros:", err);
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
        console.error("Erro ao buscar provedores:", err);
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`
        );
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Erro ao buscar países:", err);
      }
    };

    fetchGenres();
    fetchProviders();
    fetchCountries();
  }, []);

  // Busca filmes sempre que filtros ou página mudam
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const base = searchTerm
        ? "https://api.themoviedb.org/3/search/movie"
        : "https://api.themoviedb.org/3/discover/movie";

      const params = new URLSearchParams({
        api_key: API_KEY,
        language: "pt-BR",
        page: page.toString(),
        "vote_average.gte": minRating.toString(),
        "vote_average.lte": maxRating.toString(),
      });

      if (selectedGenre) params.append("with_genres", selectedGenre);
      if (selectedProvider) {
        params.append("with_watch_providers", selectedProvider);
        params.append("watch_region", "BR");
      }
      if (classification) {
        params.append("certification_country", "BR");
        params.append("certification", classification);
      }
      if (selectedCountry)
        params.append("with_origin_country", selectedCountry);
      if (searchTerm) params.append("query", searchTerm);
      if (!searchTerm && sortBy) params.append("sort_by", sortBy);

      try {
        const res = await fetch(`${base}?${params.toString()}`);
        const data = await res.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [
    page,
    sortBy,
    selectedGenre,
    selectedProvider,
    classification,
    searchTerm,
    minRating,
    maxRating,
    selectedCountry,
  ]);

  const handleCardClick = (id: number) => {
    setSelectedMovie(null); // Reseta o filme selecionado para mostrar o loading.
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`
        );
        const details = await res.json();
        setSelectedMovie(details);
      } catch (err) {
        console.error("Erro ao buscar detalhes do filme:", err);
      }
    };
    fetchDetails();
  };

  const handleClose = () => setSelectedMovie(null);

  return (
    <div className={`container mt-4 ${styles.container}`}>
      <h1 className={styles.title}>Filmes</h1>
      <Row>
        <Col md={3}>
          <Sidebar
            sortBy={sortBy}
            setSortBy={(value) => {
              setSortBy(value);
              setPage(1);
            }}
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={(value) => {
              setSelectedGenre(value);
              setPage(1);
            }}
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={(value) => {
              setSelectedProvider(value);
              setPage(1);
            }}
            searchTerm={searchTerm}
            setSearchTerm={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            classification={classification}
            setClassification={(value) => {
              setClassification(value);
              setPage(1);
            }}
            minRating={minRating}
            setMinRating={setMinRating}
            maxRating={maxRating}
            setMaxRating={setMaxRating}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={(value) => {
              setSelectedCountry(value);
              setPage(1);
            }}
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
                {movies.map((m) => (
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
              <Button
                className={styles.pageButton}
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  
                }}
              >
                Página Anterior
              </Button>

                <span>
                  Página {page} de {totalPages}
                </span>
                <Button
                  className={styles.pageButton}
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Próxima Página
                </Button>

              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Novo Modal usando o MovieDetailModal */}
      <MovieDetailModal
        show={!!selectedMovie}
        movie={selectedMovie}
        onHide={handleClose}
      />
    </div>
  );
};

export default FilmesPage;
