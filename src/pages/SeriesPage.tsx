import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import SeriesCard from "../components/SeriesCard";
import SidebarSeries from "../components/SidebarSeries";
import styles from "../styles/SeriesPage.module.css"; 
import TVShowDetailModal from "../components/SeriesDetailModal";

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

type Country = {
  iso_3166_1: string;
  english_name: string;
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
};

type Provider = {
  provider_id: number;
  provider_name: string;
};

const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<
    Record<number, Episode[]>
  >({});
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [classification, setClassification] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // IDs dos principais provedores (Netflix, Disney+, Max, Prime Video)
  const mainProviderIds = [8, 337, 1899, 119]; 

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Erro ao buscar gêneros de séries:", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/watch/providers/tv?api_key=${API_KEY}&language=pt-BR&watch_region=BR`
      );
      const data = await res.json();
      setProviders(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar provedores:", error);
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
      ? "https://api.themoviedb.org/3/search/tv"
      : "https://api.themoviedb.org/3/discover/tv";

    const params = new URLSearchParams({
      api_key: API_KEY,
      language: "pt-BR",
      page: pageNumber.toString(),
      "vote_average.gte": minRating.toString(),
      "vote_average.lte": maxRating.toString(),
    });

    if (!searchTerm) {
      params.append("sort_by", sortParam);
    }

    if (selectedGenre) {
      params.append("with_genres", selectedGenre);
    }

    if (searchTerm) {
      params.append("query", searchTerm);
    }

    // Aplicar filtro de provedores apenas se não estiver pesquisando
    if (!searchTerm) {
      // Se não houver provedor selecionado, usar os principais provedores por padrão
      const providersToFilter = selectedProvider || mainProviderIds.join('|');
      params.append("with_watch_providers", providersToFilter);
      params.append("watch_region", "BR");
    }

    if (classification) {
      params.append("certification_country", "BR");
      params.append("certification.lte", classification);
    }

    if (selectedCountry) {
      params.append("with_origin_country", selectedCountry);
    }

    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`);
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
    if (!selectedSeries || episodesBySeason[seasonNumber]) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${selectedSeries.id}/season/${seasonNumber}?api_key=${API_KEY}&language=pt-BR`
      );
      const data = await res.json();
      setEpisodesBySeason((prev) => ({
        ...prev,
        [seasonNumber]: data.episodes,
      }));
    } catch (error) {
      console.error(
        `Erro ao buscar episódios da temporada ${seasonNumber}:`,
        error
      );
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`
      );
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error("Erro ao buscar países:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchProviders();
    fetchCountries();
  }, []);

  useEffect(() => {
    // Sempre que algum filtro for alterado, a página volta para 1
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

  useEffect(() => {
    // Quando a página ou filtros mudam, carrega as séries
    fetchSeries(page, sortBy);
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

  const handleSeriesClick = (serie: Series) => {
    setSelectedSeries(serie);
    setEpisodesBySeason({});
  };

  const handleCloseModal = () => setSelectedSeries(null);

  return (
    <div className="container mt-4">
      {/* Título da página com a classe do CSS para mudar a cor */}
      <h2 className={`${styles["page-title"]} mb-4`}>Séries</h2>

      <Row>
        <Col md={3}>
          <SidebarSeries
            // Passando todas as props necessárias para o SidebarSeries
            sortBy={sortBy}
            setSortBy={setSortBy}
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            classification={classification}
            setClassification={setClassification}
            minRating={minRating}
            setMinRating={setMinRating}
            maxRating={maxRating}
            setMaxRating={setMaxRating}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        </Col>
        <Col md={9}>
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

              {/* Usando as classes do CSS para os botões de navegação */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`${styles["pagination-button"]} ${styles["previous"]}`}
                >
                  Página Anterior
                </Button>
                <span className={styles["pagination-info"]}>
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="primary"
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  
                  className={`${styles["pagination-button"]} ${styles["next"]}`}
                >
                  Próxima Página
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Usando o TVShowDetailModal */}
      <TVShowDetailModal
        show={!!selectedSeries}
        tvShow={selectedSeries}
        onHide={handleCloseModal}
        fetchEpisodes={fetchEpisodes}
        episodesBySeason={episodesBySeason}
      />
    </div>
  );
};

export default SeriesPage;