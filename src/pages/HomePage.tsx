import React, { useState } from "react";
import { Container } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import styles from "../styles/HomePage.module.css";
import TVShowDetailModal from "../components/SeriesDetailModal";
import MovieDetailModal from "../components/MovieDetailModal";
import { useHomeContent } from "../hooks/useHome";
import { Movie, Series } from "../types";
import MediaCarousel from "../components/MediaCarousel";

const HomePage: React.FC = () => {
  const {
    movies,
    streamingSeries,
    netflixMovies,
    netflixSeries,
    loadingMovies,
    loadingStreamingSeries,
    loadingNetflixMovies,
    loadingNetflixSeries,
    currentMovieIndex,
    currentStreamingSeriesIndex,
    currentNetflixMovieIndex,
    currentNetflixSeriesIndex,
    navigateCarousel,
    setCurrentMovieIndex,
    setCurrentStreamingSeriesIndex,
    setCurrentNetflixMovieIndex,
    setCurrentNetflixSeriesIndex
  } = useHomeContent();

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<Series | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, any[]>>({});

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleTVShowClick = (tvShow: Series) => setSelectedTVShow(tvShow);
  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedTVShow(null);
  };

  const fetchEpisodes = async (seasonNumber: number, tvShowId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setEpisodesBySeason(prev => ({
        ...prev,
        [seasonNumber]: data.episodes || [],
      }));
    } catch (error) {
      console.error("Erro ao buscar episódios:", error);
    }
  };

  const renderMovieItem = (movie: Movie) => (
    <MovieCard
      title={movie.title}
      imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      description={movie.overview}
      rating={movie.vote_average}
      onClick={() => handleMovieClick(movie)}
    />
  );

  const renderSeriesItem = (series: Series) => (
    <SeriesCard
      title={series.name}
      imageUrl={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
      description={series.overview}
      seasons={series.number_of_seasons || 0}
      rating={series.vote_average}
      onClick={() => handleTVShowClick(series)}
    />
  );

  return (
    <Container fluid className={styles.container}>
      <h1 className="text-center mb-4 text-white">Bem-vindo ao MediaVault</h1>

      {/* Filmes Populares */}
      <MediaCarousel<Movie>
        items={movies}
        currentIndex={currentMovieIndex}
        loading={loadingMovies}
        title="Filmes Populares"
        onPrev={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, movies, 'prev')}
        onNext={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, movies, 'next')}
        renderItem={renderMovieItem}
        carouselType="movie"
        emptyMessage="Nenhum filme popular encontrado."
      />

      {/* Filmes da Netflix */}
      <MediaCarousel<Movie>
        items={netflixMovies}
        currentIndex={currentNetflixMovieIndex}
        loading={loadingNetflixMovies}
        title="Filmes Populares na Netflix"
        onPrev={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, netflixMovies, 'prev')}
        onNext={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, netflixMovies, 'next')}
        renderItem={renderMovieItem}
        carouselType="movie"
        emptyMessage="Nenhum filme da Netflix encontrado."
      />

      {/* Séries Populares nos Streamers */}
      <MediaCarousel<Series>
        items={streamingSeries}
        currentIndex={currentStreamingSeriesIndex}
        loading={loadingStreamingSeries}
        title="Séries Populares nos Principais Streamers"
        onPrev={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, streamingSeries, 'prev')}
        onNext={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, streamingSeries, 'next')}
        renderItem={renderSeriesItem}
        carouselType="tvShow"
        emptyMessage="Nenhuma série popular encontrada."
      />

      {/* Séries da Netflix */}
      <MediaCarousel<Series>
        items={netflixSeries}
        currentIndex={currentNetflixSeriesIndex}
        loading={loadingNetflixSeries}
        title="Séries Populares na Netflix"
        onPrev={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, netflixSeries, 'prev')}
        onNext={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, netflixSeries, 'next')}
        renderItem={renderSeriesItem}
        carouselType="tvShow"
        emptyMessage="Nenhuma série da Netflix encontrada."
      />

      {/* Modais para detalhes */}
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