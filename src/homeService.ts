// src/services/homeService.ts

import { Movie, Series } from "./types";
import { fetchMediaProviders } from "./StreamingProviders";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch popular movies and enrich them with streaming providers
 */
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching popular movies: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Enriquecer os filmes com seus provedores de streaming
    const moviesWithProviders = await Promise.all(
      data.results.map(async (movie: Movie) => {
        const providers = await fetchMediaProviders('movie', movie.id);
        return { ...movie, providers };
      })
    );
    
    return moviesWithProviders;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

/**
 * Fetch popular streaming series and enrich them with streaming providers
 */
export const fetchStreamingSeries = async (): Promise<Series[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching streaming series: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Enriquecer as séries com seus provedores de streaming
    const seriesWithProviders = await Promise.all(
      data.results.map(async (series: Series) => {
        const providers = await fetchMediaProviders('tv', series.id);
        return { ...series, providers };
      })
    );
    
    return seriesWithProviders;
  } catch (error) {
    console.error("Error fetching streaming series:", error);
    return [];
  }
};

/**
 * Fetch Netflix content (movies or TV shows)
 * @param type 'movie' or 'tv'
 */
export const fetchNetflixContent = async (type: 'movie' | 'tv'): Promise<Movie[] | Series[]> => {
  try {
    // Primeiro busca conteúdo popular
    const popularEndpoint = type === 'movie' 
      ? `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
      : `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
    
    const response = await fetch(popularEndpoint);
    
    if (!response.ok) {
      throw new Error(`Error fetching ${type} content: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Enriquecer o conteúdo com provedores e filtrar apenas os da Netflix
    const contentWithProviders = await Promise.all(
      data.results.map(async (item: Movie | Series) => {
        const providers = await fetchMediaProviders(type, item.id);
        return { ...item, providers };
      })
    );
    
    // Filtrar apenas o conteúdo disponível na Netflix
    const netflixContent = contentWithProviders.filter(
      (item) => item.providers && item.providers.includes('netflix')
    );
    
    return netflixContent;
  } catch (error) {
    console.error(`Error fetching Netflix ${type} content:`, error);
    return [];
  }
};