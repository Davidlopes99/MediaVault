import { useState, useEffect } from "react";
import { 
  fetchGenres, 
  fetchProviders, 
  fetchCountries, 
  fetchSeries,
  fetchSeriesDetails,
  fetchEpisodes
} from "../services/seriesService";
import { Series, Episode, Genre, Provider, Country } from "../types";

export const useSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, Episode[]>>({});

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

  // Reseta a página quando filtros mudam
  useEffect(() => {
    setPage(1);
  }, [
    sortBy,
    selectedGenre,
    selectedProvider,
    searchTerm,
    classification,
    minRating,
    maxRating,
    selectedCountry,
  ]);

  // Busca séries sempre que filtros ou página mudam
  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      try {
        const { results, total_pages } = await fetchSeries({
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
        
        setSeries(results);
        setTotalPages(total_pages);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [
    page,
    sortBy,
    selectedGenre,
    selectedProvider,
    searchTerm,
    classification,
    minRating,
    maxRating,
    selectedCountry,
  ]);

  const handleSeriesClick = async (series: Series) => {
    setSelectedSeries(null);
    setEpisodesBySeason({});
    try {
      const seriesDetails = await fetchSeriesDetails(series.id);
      setSelectedSeries(seriesDetails);
    } catch (error) {
      console.error("Failed to fetch series details:", error);
    }
  };

  const handleFetchEpisodes = async (seasonNumber: number) => {
    if (!selectedSeries || episodesBySeason[seasonNumber]) return;
    try {
      const episodes = await fetchEpisodes(selectedSeries.id, seasonNumber);
      setEpisodesBySeason(prev => ({
        ...prev,
        [seasonNumber]: episodes,
      }));
    } catch (error) {
      console.error(`Failed to fetch episodes for season ${seasonNumber}:`, error);
    }
  };

  const handleCloseModal = () => setSelectedSeries(null);

  return {
    series,
    page,
    loading,
    totalPages,
    selectedSeries,
    episodesBySeason,
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
    handleSeriesClick,
    handleFetchEpisodes,
    handleCloseModal,
  };
};