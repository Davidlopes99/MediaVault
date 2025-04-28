import { useState, useEffect } from "react";
import { 
  fetchGenres, 
  fetchProviders, 
  fetchCountries, 
  fetchMovies,
  fetchMovieDetails
} from "../services/movieService";
import { Movie, Genre, Provider, Country } from "../types";

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  // Busca gêneros, provedores e países na montagem
  useEffect(() => {
    const loadInitialData = async () => {
      const [genresData, providersData, countriesData] = await Promise.all([
        fetchGenres(),
        fetchProviders(),
        fetchCountries()
      ]);
      
      setGenres(genresData);
      setProviders(providersData);
      setCountries(countriesData);
    };

    loadInitialData();
  }, []);

  // Busca filmes sempre que filtros ou página mudam
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const { results, total_pages } = await fetchMovies({
          page,
          sortBy,
          selectedGenre,
          selectedProvider,
          classification,
          searchTerm,
          minRating,
          maxRating,
          selectedCountry
        });
        
        setMovies(results);
        setTotalPages(total_pages);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
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

  const handleCardClick = async (id: number) => {
    setSelectedMovie(null);
    try {
      const movieDetails = await fetchMovieDetails(id);
      setSelectedMovie(movieDetails);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
    }
  };

  const handleCloseModal = () => setSelectedMovie(null);

  return {
    movies,
    page,
    loading,
    totalPages,
    selectedMovie,
    genres,
    selectedGenre,
    providers,
    selectedProvider,
    countries,
    selectedCountry,
    sortBy,
    searchTerm,
    classification,
    minRating,
    maxRating,
    setPage,
    setSortBy,
    setSelectedGenre,
    setSelectedProvider,
    setSearchTerm,
    setClassification,
    setMinRating,
    setMaxRating,
    setSelectedCountry,
    handleCardClick,
    handleCloseModal,
  };
};