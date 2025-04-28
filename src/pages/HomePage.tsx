import React, { useState, useEffect } from "react";
import { Container, Alert, Tabs, Tab } from "react-bootstrap";
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [filteredNetflixMovies, setFilteredNetflixMovies] = useState<Movie[]>([]);
  const [filteredNetflixSeries, setFilteredNetflixSeries] = useState<Series[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  // Initialize with original data when it loads
  useEffect(() => {
    if (!loadingMovies) {
      setFilteredMovies(movies);
    }
    if (!loadingStreamingSeries) {
      setFilteredSeries(streamingSeries);
    }
    if (!loadingNetflixMovies) {
      setFilteredNetflixMovies(netflixMovies);
    }
    if (!loadingNetflixSeries) {
      setFilteredNetflixSeries(netflixSeries);
    }
  }, [
    movies, 
    streamingSeries, 
    netflixMovies, 
    netflixSeries,
    loadingMovies,
    loadingStreamingSeries,
    loadingNetflixMovies,
    loadingNetflixSeries
  ]);

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleTVShowClick = (tvShow: Series) => setSelectedTVShow(tvShow);
  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedTVShow(null);
  };

  const fetchEpisodes = async (seasonNumber: number, tvShowId: number) => {
    try {
      setHasError(false);
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=pt-BR`
      );
      
      if (!res.ok) {
        throw new Error(`Failed to fetch episodes: ${res.status}`);
      }
      
      const data = await res.json();
      setEpisodesBySeason(prev => ({
        ...prev,
        [seasonNumber]: data.episodes || [],
      }));
    } catch (error) {
      console.error("Erro ao buscar episódios:", error);
      setHasError(true);
    }
  };

  const renderMovieItem = (movie: Movie) => (
    <MovieCard
      title={movie.title}
      imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'}
      description={movie.overview || "Sem descrição disponível"}
      rating={movie.vote_average}
      releaseDate={movie.release_date}
      onClick={() => handleMovieClick(movie)}
    />
  );

  const renderSeriesItem = (series: Series) => (
    <SeriesCard
      series={series}
      onClick={() => handleTVShowClick(series)}
    />
  );
  

  return (
    <Container fluid className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>MediaVault</h1>
        <p className={styles.subtitle}>Seu guia para filmes e séries em streaming</p>
      </header>

      {hasError && (
        <Alert variant="danger" onClose={() => setHasError(false)} dismissible>
          Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "all")}
        className={styles.contentTabs}
      >
        <Tab eventKey="all" title="Todos">
          {/* Filmes Populares */}
          <MediaCarousel<Movie>
            items={filteredMovies}
            currentIndex={currentMovieIndex}
            loading={loadingMovies}
            title="Filmes Populares"
            onPrev={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, filteredMovies, 'prev')}
            onNext={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, filteredMovies, 'next')}
            renderItem={renderMovieItem}
            carouselType="movie"
            emptyMessage="Nenhum filme popular encontrado."
          />

          {/* Séries Populares nos Streamers */}
          <MediaCarousel<Series>
            items={filteredSeries}
            currentIndex={currentStreamingSeriesIndex}
            loading={loadingStreamingSeries}
            title="Séries Populares nos Principais Streamers"
            onPrev={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, filteredSeries, 'prev')}
            onNext={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, filteredSeries, 'next')}
            renderItem={renderSeriesItem}
            carouselType="tvShow"
            emptyMessage="Nenhuma série popular encontrada."
          />

          {/* Filmes da Netflix */}
          <MediaCarousel<Movie>
            items={filteredNetflixMovies}
            currentIndex={currentNetflixMovieIndex}
            loading={loadingNetflixMovies}
            title="Filmes Populares na Netflix"
            onPrev={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, filteredNetflixMovies, 'prev')}
            onNext={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, filteredNetflixMovies, 'next')}
            renderItem={renderMovieItem}
            carouselType="movie"
            emptyMessage="Nenhum filme da Netflix encontrado."
          />

          {/* Séries da Netflix */}
          <MediaCarousel<Series>
            items={filteredNetflixSeries}
            currentIndex={currentNetflixSeriesIndex}
            loading={loadingNetflixSeries}
            title="Séries Populares na Netflix"
            onPrev={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, filteredNetflixSeries, 'prev')}
            onNext={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, filteredNetflixSeries, 'next')}
            renderItem={renderSeriesItem}
            carouselType="tvShow"
            emptyMessage="Nenhuma série da Netflix encontrada."
          />
        </Tab>
        
        <Tab eventKey="movies" title="Filmes">
          <MediaCarousel<Movie>
            items={filteredMovies}
            currentIndex={currentMovieIndex}
            loading={loadingMovies}
            title="Filmes Populares"
            onPrev={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, filteredMovies, 'prev')}
            onNext={() => navigateCarousel(currentMovieIndex, setCurrentMovieIndex, filteredMovies, 'next')}
            renderItem={renderMovieItem}
            carouselType="movie"
            emptyMessage="Nenhum filme popular encontrado."
          />
          
          <MediaCarousel<Movie>
            items={filteredNetflixMovies}
            currentIndex={currentNetflixMovieIndex}
            loading={loadingNetflixMovies}
            title="Filmes Populares na Netflix"
            onPrev={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, filteredNetflixMovies, 'prev')}
            onNext={() => navigateCarousel(currentNetflixMovieIndex, setCurrentNetflixMovieIndex, filteredNetflixMovies, 'next')}
            renderItem={renderMovieItem}
            carouselType="movie"
            emptyMessage="Nenhum filme da Netflix encontrado."
          />
        </Tab>
        
        <Tab eventKey="series" title="Séries">
          <MediaCarousel<Series>
            items={filteredSeries}
            currentIndex={currentStreamingSeriesIndex}
            loading={loadingStreamingSeries}
            title="Séries Populares nos Principais Streamers"
            onPrev={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, filteredSeries, 'prev')}
            onNext={() => navigateCarousel(currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex, filteredSeries, 'next')}
            renderItem={renderSeriesItem}
            carouselType="tvShow"
            emptyMessage="Nenhuma série popular encontrada."
          />
          
          <MediaCarousel<Series>
            items={filteredNetflixSeries}
            currentIndex={currentNetflixSeriesIndex}
            loading={loadingNetflixSeries}
            title="Séries Populares na Netflix"
            onPrev={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, filteredNetflixSeries, 'prev')}
            onNext={() => navigateCarousel(currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex, filteredNetflixSeries, 'next')}
            renderItem={renderSeriesItem}
            carouselType="tvShow"
            emptyMessage="Nenhuma série da Netflix encontrada."
          />
        </Tab>
      </Tabs>

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