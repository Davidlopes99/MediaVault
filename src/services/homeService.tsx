import { Movie, Series } from "../types";
import { fetchMovieDetails } from "./movieService";
import { fetchSeriesDetails } from "./seriesService";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// IDs dos principais provedores: Netflix (8), Disney+ (337), Max (1899), Prime Video (119)
const STREAMING_PROVIDER_IDS = "8|337|1899|119";
const NETFLIX_PROVIDER_ID = "8";

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
    const data = await res.json();
    
    const moviesWithDetails = await Promise.all(
      data.results.map(async (movie: Movie) => {
        try {
          const details = await fetchMovieDetails(movie.id);
          return { ...movie, genres: details.genres || [] };
        } catch {
          return { ...movie, genres: [] };
        }
      })
    );
    
    return moviesWithDetails;
  } catch (error) {
    console.error("Erro ao buscar filmes populares:", error);
    return [];
  }
};

export const fetchStreamingSeries = async (): Promise<Series[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&with_watch_providers=${STREAMING_PROVIDER_IDS}&watch_region=BR&sort_by=popularity.desc`
    );
    const data = await res.json();

    const seriesWithDetails = await Promise.all(
      data.results.map(async (series: Series) => {
        try {
          const details = await fetchSeriesDetails(series.id);
          return {
            ...series,
            number_of_seasons: details.number_of_seasons || 0,
          };
        } catch {
          return { ...series, number_of_seasons: 0 };
        }
      })
    );

    return seriesWithDetails;
  } catch (error) {
    console.error("Erro ao buscar séries dos streamers:", error);
    return [];
  }
};

export const fetchNetflixContent = async (type: 'movie' | 'tv'): Promise<Movie[] | Series[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=pt-BR&with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR`
    );
    const data = await res.json();

    if (type === 'movie') {
      const movies = data.results as Movie[];
      const moviesWithDetails = await Promise.all(
        movies.map(async (movie: Movie) => {
          try {
            const details = await fetchMovieDetails(movie.id);
            return { ...movie, genres: details.genres || [] };
          } catch {
            return { ...movie, genres: [] };
          }
        })
      );
      return moviesWithDetails;
    } else {
      const series = data.results as Series[];
      const seriesWithDetails = await Promise.all(
        series.map(async (series: Series) => {
          try {
            const details = await fetchSeriesDetails(series.id);
            return {
              ...series,
              number_of_seasons: details.number_of_seasons || 0,
            };
          } catch {
            return { ...series, number_of_seasons: 0 };
          }
        })
      );
      return seriesWithDetails;
    }
  } catch (error) {
    console.error(`Erro ao buscar ${type === 'movie' ? 'filmes' : 'séries'} da Netflix:`, error);
    return [];
  }
};