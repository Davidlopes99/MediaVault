import { Series, Episode, Provider, Genre, Country,SeriesFilterParams } from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MAIN_PROVIDER_IDS = [8, 337, 1899, 119];

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const res = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=pt-BR`);
    const data = await res.json();
    return data.genres;
  } catch (error) {
    console.error("Erro ao buscar gêneros de séries:", error);
    return [];
  }
};

export const fetchProviders = async (): Promise<Provider[]> => {
  try {
    const res = await fetch(`${BASE_URL}/watch/providers/tv?api_key=${API_KEY}&language=pt-BR&watch_region=BR`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar provedores:", error);
    return [];
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar países:", error);
    return [];
  }
};

export const fetchSeries = async (params: SeriesFilterParams): Promise<{ results: Series[]; total_pages: number }> => {
  const baseUrl = params.searchTerm
    ? `${BASE_URL}/search/tv`
    : `${BASE_URL}/discover/tv`;

  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    language: "pt-BR",
    page: params.page.toString(),
    "vote_average.gte": params.minRating.toString(),
    "vote_average.lte": params.maxRating.toString(),
  });

  if (!params.searchTerm) {
    urlParams.append("sort_by", params.sortBy);
  }

  if (params.selectedGenre) {
    urlParams.append("with_genres", params.selectedGenre);
  }

  if (params.searchTerm) {
    urlParams.append("query", params.searchTerm);
  }

  // Aplicar filtro de provedores apenas se não estiver pesquisando
  if (!params.searchTerm) {
    const providersToFilter = params.selectedProvider || MAIN_PROVIDER_IDS.join('|');
    urlParams.append("with_watch_providers", providersToFilter);
    urlParams.append("watch_region", "BR");
  }

  if (params.classification) {
    urlParams.append("certification_country", "BR");
    urlParams.append("certification.lte", params.classification);
  }

  if (params.selectedCountry) {
    urlParams.append("with_origin_country", params.selectedCountry);
  }

  try {
    const response = await fetch(`${baseUrl}?${urlParams.toString()}`);
    const data = await response.json();
    
    // Adiciona detalhes adicionais às séries
    const detailedSeries = await Promise.all(
      data.results.map(async (s: Series) => {
        try {
          const res = await fetch(`${BASE_URL}/tv/${s.id}?api_key=${API_KEY}&language=pt-BR`);
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

    return {
      results: detailedSeries,
      total_pages: data.total_pages
    };
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return { results: [], total_pages: 1 };
  }
};

export const fetchSeriesDetails = async (id: number): Promise<Series> => {
  try {
    const [detailsRes, streamingRes] = await Promise.all([
      fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`),
      fetch(`${BASE_URL}/tv/${id}/watch/providers?api_key=${API_KEY}&language=pt-BR`),
    ]);

    const details = await detailsRes.json();
    const streamingData = await streamingRes.json();

    const streamingPlatforms = streamingData.results?.BR?.flatrate?.map(
      (provider: Provider) => provider.provider_name
    );

    return {
      ...details,
      streamingPlatforms: streamingPlatforms || [],
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes da série:", error);
    throw error;
  }
};

export const fetchEpisodes = async (seriesId: number, seasonNumber: number): Promise<Episode[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await res.json();
    return data.episodes;
  } catch (error) {
    console.error(`Erro ao buscar episódios da temporada ${seasonNumber}:`, error);
    throw error;
  }
};