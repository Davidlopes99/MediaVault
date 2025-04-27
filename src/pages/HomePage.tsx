import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Button, Container } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import styles from "../styles/HomePage.module.css";
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
  const [netflixMovies, setNetflixMovies] = useState<Movie[]>([]);
  const [netflixTvShows, setNetflixTvShows] = useState<TVShow[]>([]);
  const [streamingTvShows, setStreamingTvShows] = useState<TVShow[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTVShows, setLoadingTVShows] = useState(true);
  const [loadingNetflixMovies, setLoadingNetflixMovies] = useState(true);
  const [loadingStreamingTvShows, setLoadingStreamingTvShows] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, Episode[]>>({});
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentTVShowIndex, setCurrentTVShowIndex] = useState(0);
  const [currentNetflixMovieIndex, setCurrentNetflixMovieIndex] = useState(0);
  const [currentStreamingTVShowIndex, setCurrentStreamingTVShowIndex] = useState(0);
  const [loadingNetflixTvShows, setLoadingNetflixTvShows] = useState(true);
  const [currentNetflixTVShowIndex, setCurrentNetflixTVShowIndex] = useState(0);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  // IDs dos principais provedores: Netflix (8), Disney+ (337), Max (1899), Prime Video (119)
  const STREAMING_PROVIDER_IDS = "8|337|1899|119";
  const NETFLIX_PROVIDER_ID = "8";

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

  const fetchStreamingTvShows = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_watch_providers=${STREAMING_PROVIDER_IDS}&watch_region=BR&sort_by=popularity.desc`
      );
      const data = await res.json();

      const tvShowsWithSeasons = await Promise.all(
        data.results.map(async (tvShow: TVShow) => {
          const detailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}&language=pt-BR`
          );
          const detailsData = await detailsRes.json();
          return {
            ...tvShow,
            number_of_seasons: detailsData.number_of_seasons,
          };
        })
      );

      setStreamingTvShows(tvShowsWithSeasons);
    } catch (error) {
      console.error("Erro ao buscar séries dos streamers:", error);
    } finally {
      setLoadingStreamingTvShows(false);
    }
  };

  const fetchNetflixMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_watch_providers=8&watch_region=BR`
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
      setNetflixMovies(moviesWithGenres);
    } catch (error) {
      console.error("Erro ao buscar filmes da Netflix:", error);
    } finally {
      setLoadingNetflixMovies(false);
    }
  };
  
  const fetchNetflixTvShows = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR`
      );
      const data = await res.json();

      const tvShowsWithSeasons = await Promise.all(
        data.results.map(async (tvShow: TVShow) => {
          const detailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}&language=pt-BR`
          );
          const detailsData = await detailsRes.json();
          return {
            ...tvShow,
            number_of_seasons: detailsData.number_of_seasons,
          };
        })
      );

      setNetflixTvShows(tvShowsWithSeasons);
    } catch (error) {
      console.error("Erro ao buscar séries da Netflix:", error);
    } finally {
      setLoadingNetflixTvShows(false);
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

  // Funções para navegação nos carrosseis
  const nextMovies = () => setCurrentMovieIndex(prev => Math.min(prev + 4, movies.length - 4));
  const prevMovies = () => setCurrentMovieIndex(prev => Math.max(prev - 4, 0));
  const nextTVShows = () => setCurrentTVShowIndex(prev => Math.min(prev + 4, tvShows.length - 4));
  const prevTVShows = () => setCurrentTVShowIndex(prev => Math.max(prev - 4, 0));
  const nextNetflixMovies = () => setCurrentNetflixMovieIndex(prev => Math.min(prev + 4, netflixMovies.length - 4));
  const prevNetflixMovies = () => setCurrentNetflixMovieIndex(prev => Math.max(prev - 4, 0));
  const nextStreamingTVShows = () => setCurrentStreamingTVShowIndex(prev => Math.min(prev + 4, streamingTvShows.length - 4));
  const prevStreamingTVShows = () => setCurrentStreamingTVShowIndex(prev => Math.max(prev - 4, 0));
  const nextNetflixTVShows = () => setCurrentNetflixTVShowIndex(prev => Math.min(prev + 4, netflixTvShows.length - 4));
  const prevNetflixTVShows = () => setCurrentNetflixTVShowIndex(prev => Math.max(prev - 4, 0));

  useEffect(() => {
    fetchMovies();
    fetchStreamingTvShows();
    fetchNetflixMovies();
    fetchNetflixTvShows();
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
              <Button onClick={prevMovies} className={`${styles.carouselControlPrev}`}>
                &lt;
              </Button>
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
              <Button onClick={nextMovies} className={`${styles.carouselControlNext}`}>
                &gt;
              </Button>
            </>
          )}
        </Row>
      </section>

      {/* Filmes da Netflix */}
      <section className="mt-5">
        <h2 className={`${styles.sectionTitle} mb-4`}>Filmes Populares na Netflix</h2>
        <Row className={`${styles.movieCarousel} d-flex justify-content-center`}>
          {loadingNetflixMovies ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando filmes da Netflix...</p>
            </div>
          ) : (
            <>
              <Button onClick={prevNetflixMovies} className={`${styles.carouselControlPrev}`}>
                &lt;
              </Button>
              {netflixMovies.slice(currentNetflixMovieIndex, currentNetflixMovieIndex + 4).map((movie) => (
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
              <Button onClick={nextNetflixMovies} className={`${styles.carouselControlNext}`}>
                &gt;
              </Button>
            </>
          )}
        </Row>
      </section>

      {/* Séries Populares (agora apenas dos streamers principais) */}
      <section className="mt-5">
        <h2 className={`${styles.sectionTitle} mb-4`}>Séries Populares nos Principais Streamers</h2>
        <Row className={`${styles.tvShowCarousel} d-flex justify-content-center`}>
          {loadingStreamingTvShows ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando séries...</p>
            </div>
          ) : (
            <>
              <Button onClick={prevStreamingTVShows} className={`${styles.carouselControlPrev}`}>
                &lt;
              </Button>
              {streamingTvShows.slice(currentStreamingTVShowIndex, currentStreamingTVShowIndex + 4).map((tvShow) => (
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
              <Button onClick={nextStreamingTVShows} className={`${styles.carouselControlNext}`}>
                &gt;
              </Button>
            </>
          )}
        </Row>
      </section>
      {/* Séries da Netflix */}
      <section className="mt-5">
        <h2 className={`${styles.sectionTitle} mb-4`}>Séries Populares na Netflix</h2>
        <Row className={`${styles.tvShowCarousel} d-flex justify-content-center`}>
          {loadingNetflixTvShows ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando séries da Netflix...</p>
            </div>
          ) : (
            <>
              <Button onClick={prevNetflixTVShows} className={`${styles.carouselControlPrev}`}>
                &lt;
              </Button>
              {netflixTvShows.slice(currentNetflixTVShowIndex, currentNetflixTVShowIndex + 4).map((tvShow) => (
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
              <Button onClick={nextNetflixTVShows} className={`${styles.carouselControlNext}`}>
                &gt;
              </Button>
            </>
          )}
        </Row>
      </section>
      {/* Modais para detalhes de filme e série */}
      <MovieDetailModal
        show={!!selectedMovie}
        movie={selectedMovie}
        onHide={handleCloseModal}
      />
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