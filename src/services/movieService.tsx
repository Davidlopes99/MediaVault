import { Movie, Provider, Genre, Country } from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
    const data = await res.json();
    return data.genres;
  } catch (err) {
    console.error("Erro ao buscar gêneros:", err);
    return [];
  }
};

export const fetchProviders = async (): Promise<Provider[]> => {
  try {
    const res = await fetch(`${BASE_URL}/watch/providers/movie?api_key=${API_KEY}&language=pt-BR&watch_region=BR`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Erro ao buscar provedores:", err);
    return [];
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erro ao buscar países:", err);
    return [];
  }
};

export const fetchMovies = async (params: {
  page: number;
  sortBy: string;
  selectedGenre: string;
  selectedProvider: string;
  classification: string;
  searchTerm: string;
  minRating: number;
  maxRating: number;
  selectedCountry: string;
}): Promise<{ results: Movie[]; total_pages: number }> => {
  const base = params.searchTerm
    ? `${BASE_URL}/search/movie`
    : `${BASE_URL}/discover/movie`;

  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    language: "pt-BR",
    page: params.page.toString(),
    "vote_average.gte": params.minRating.toString(),
    "vote_average.lte": params.maxRating.toString(),
  });

  if (params.selectedGenre) urlParams.append("with_genres", params.selectedGenre);
  if (params.selectedProvider) {
    urlParams.append("with_watch_providers", params.selectedProvider);
    urlParams.append("watch_region", "BR");
  }
  if (params.classification) {
    urlParams.append("certification_country", "BR");
    urlParams.append("certification", params.classification);
  }
  if (params.selectedCountry) urlParams.append("with_origin_country", params.selectedCountry);
  if (params.searchTerm) urlParams.append("query", params.searchTerm);
  if (!params.searchTerm && params.sortBy) urlParams.append("sort_by", params.sortBy);

  try {
    const res = await fetch(`${base}?${urlParams.toString()}`);
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    return { results: [], total_pages: 1 };
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const [detailsRes, streamingRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`),
      fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}&language=pt-BR`),
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
  } catch (err) {
    console.error("Erro ao buscar detalhes do filme:", err);
    throw err;
  }
};