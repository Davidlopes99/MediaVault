import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Button, Container } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import styles from "../styles/HomePage.module.css"; // Importa o módulo de CSS
import TVShowDetailModal from "../components/SeriesDetailModal";
import MovieDetailModal from "../components/MovieDetailModal";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres?: { id: number; name: string }[];
};

type TVShow = {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  number_of_seasons: number;
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
};

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTVShows, setLoadingTVShows] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, Episode[]>>({});
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentTVShowIndex, setCurrentTVShowIndex] = useState(0);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const fetchMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      const moviesWithGenres = await Promise.all(
        data.results.map(async (movie: Movie) => {
          const genresRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`
          );
          const movieData = await genresRes.json();
          return { ...movie, genres: movieData.genres || [] };
        })
      );
      setMovies(moviesWithGenres);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchTvShows = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_networks=273`
      );
      const data = await res.json();

      const tvShowsWithSeasons = await Promise.all(
        data.results.map(async (tvShow: TVShow) => {
          const detailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}&language=pt-BR`
          );
          const detailsData = await detailsRes.json();
          return { ...tvShow, number_of_seasons: detailsData.number_of_seasons };
        })
      );

      setTvShows(tvShowsWithSeasons);
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
    } finally {
      setLoadingTVShows(false);
    }
  };

  const fetchEpisodes = async (seasonNumber: number, tvShowId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setEpisodesBySeason((prev) => ({
        ...prev,
        [seasonNumber]: data.episodes || [],
      }));
    } catch (error) {
      console.error("Erro ao buscar episódios:", error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleTVShowClick = (tvShow: TVShow) => {
    setSelectedTVShow(tvShow);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedTVShow(null);
  };

  const nextMovies = () => {
    if (currentMovieIndex + 4 < movies.length) {
      setCurrentMovieIndex(currentMovieIndex + 4);
    }
  };

  const prevMovies = () => {
    if (currentMovieIndex - 4 >= 0) {
      setCurrentMovieIndex(currentMovieIndex - 4);
    }
  };

  const nextTVShows = () => {
    if (currentTVShowIndex + 4 < tvShows.length) {
      setCurrentTVShowIndex(currentTVShowIndex + 4);
    }
  };

  const prevTVShows = () => {
    if (currentTVShowIndex - 4 >= 0) {
      setCurrentTVShowIndex(currentTVShowIndex - 4);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  return (
    <Container fluid className={`${styles.container} mt-4`}>
      <h1 className="text-center mb-4"></h1>
      
      {/* Filmes Populares */}
      <section>
        <h2 className={`${styles.sectionTitle} mb-4`}>Filmes Populares</h2>
        <Row className={`${styles.movieCarousel} d-flex justify-content-center`}>
          {loadingMovies ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando filmes...</p>
            </div>
          ) : (
            <>
              <Button onClick={prevMovies} className={`${styles.carouselControlPrev}`}>&lt;</Button>
              {movies.slice(currentMovieIndex, currentMovieIndex + 4).map((movie) => (
                <Col md={3} key={movie.id} className={`${styles.movieCardCol} mb-4`}>
                  <MovieCard
                    title={movie.title}
                    imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    description={movie.overview}
                    rating={movie.vote_average}
                    onClick={() => handleMovieClick(movie)}
                  />
                </Col>
              ))}
              <Button onClick={nextMovies} className={`${styles.carouselControlNext}`}>&gt;</Button>
            </>
          )}
        </Row>
      </section>

      {/* Séries Populares */}
      <section className="mt-5">
        <h2 className={`${styles.sectionTitle} mb-4`}>Séries Populares</h2>
        <Row className={`${styles.tvShowCarousel} d-flex justify-content-center`}>
          {loadingTVShows ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando séries...</p>
            </div>
          ) : (
            <>
              <Button onClick={prevTVShows} className={`${styles.carouselControlPrev}`}>&lt;</Button>
              {tvShows.slice(currentTVShowIndex, currentTVShowIndex + 4).map((tvShow) => (
                <Col md={3} key={tvShow.id} className={`${styles.tvShowCardCol} mb-4`}>
                  <SeriesCard
                    title={tvShow.name}
                    imageUrl={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    description={tvShow.overview}
                    seasons={tvShow.number_of_seasons || 0}
                    rating={tvShow.vote_average}
                    onClick={() => handleTVShowClick(tvShow)}
                  />
                </Col>
              ))}
              <Button onClick={nextTVShows} className={`${styles.carouselControlNext}`}>&gt;</Button>
            </>
          )}
        </Row>
      </section>

      {/* Modais para detalhes de filme e série */}
      <MovieDetailModal show={!!selectedMovie} movie={selectedMovie} onHide={handleCloseModal} />
      <TVShowDetailModal
        show={!!selectedTVShow}
        tvShow={selectedTVShow}
        onHide={handleCloseModal}
        fetchEpisodes={fetchEpisodes}
        episodesBySeason={episodesBySeason}
      />
    </Container>
  );
};

export default HomePage;
