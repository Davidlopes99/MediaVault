import { useState, useEffect } from "react";
import { 
  fetchPopularMovies, 
  fetchStreamingSeries, 
  fetchNetflixContent 
} from "../services/homeService";
import { Movie, Series } from "../types";

export const useHomeContent = () => {
  // Estados para os conteúdos
  const [movies, setMovies] = useState<Movie[]>([]);
  const [streamingSeries, setStreamingSeries] = useState<Series[]>([]);
  const [netflixMovies, setNetflixMovies] = useState<Movie[]>([]);
  const [netflixSeries, setNetflixSeries] = useState<Series[]>([]);

  // Estados de loading
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingStreamingSeries, setLoadingStreamingSeries] = useState(true);
  const [loadingNetflixMovies, setLoadingNetflixMovies] = useState(true);
  const [loadingNetflixSeries, setLoadingNetflixSeries] = useState(true);

  // Estados para os carrosseis
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentStreamingSeriesIndex, setCurrentStreamingSeriesIndex] = useState(0);
  const [currentNetflixMovieIndex, setCurrentNetflixMovieIndex] = useState(0);
  const [currentNetflixSeriesIndex, setCurrentNetflixSeriesIndex] = useState(0);

  // Carrega todos os conteúdos na montagem
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [
          popularMovies, 
          streamingShows, 
          netflixMoviesData, 
          netflixSeriesData
        ] = await Promise.all([
          fetchPopularMovies(),
          fetchStreamingSeries(),
          fetchNetflixContent('movie'),
          fetchNetflixContent('tv')
        ]);

        setMovies(popularMovies);
        setStreamingSeries(streamingShows);
        setNetflixMovies(netflixMoviesData as Movie[]);
        setNetflixSeries(netflixSeriesData as Series[]);
      } finally {
        setLoadingMovies(false);
        setLoadingStreamingSeries(false);
        setLoadingNetflixMovies(false);
        setLoadingNetflixSeries(false);
      }
    };

    loadContent();
  }, []);

  // Funções de navegação dos carrosseis
  const navigateCarousel = (
    currentIndex: number, 
    setIndex: React.Dispatch<React.SetStateAction<number>>, 
    items: any[], 
    direction: 'next' | 'prev',
    itemsPerPage: number = 4
  ) => {
    if (direction === 'next') {
      setIndex(prev => Math.min(prev + itemsPerPage, items.length - itemsPerPage));
    } else {
      setIndex(prev => Math.max(prev - itemsPerPage, 0));
    }
  };

  return {
    // Conteúdos
    movies,
    streamingSeries,
    netflixMovies,
    netflixSeries,
    
    // Estados de loading
    loadingMovies,
    loadingStreamingSeries,
    loadingNetflixMovies,
    loadingNetflixSeries,
    
    // Índices dos carrosseis
    currentMovieIndex,
    currentStreamingSeriesIndex,
    currentNetflixMovieIndex,
    currentNetflixSeriesIndex,
    
    // Funções de navegação
    navigateCarousel,
    setCurrentMovieIndex,
    setCurrentStreamingSeriesIndex,
    setCurrentNetflixMovieIndex,
    setCurrentNetflixSeriesIndex
  };
};