import { StreamerType } from './StreamingProviders';

export interface Media {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  providers?: StreamerType[]; // Provedores de streaming onde o conteúdo está disponível
}

export interface Movie extends Media {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  streamingPlatforms?: string[];
};

export type Provider = { 
  provider_id: number; 
  provider_name: string 
};

export type Genre = { 
  id: number; 
  name: string 
};

export type Country = { 
  iso_3166_1: string; 
  english_name: string 
};

export type MovieFilterParams = {
  page: number;
  sortBy: string;
  selectedGenre: string;
  selectedProvider: string;
  classification: string;
  searchTerm: string;
  minRating: number;
  maxRating: number;
  selectedCountry: string;
};
  
export interface Series extends Media {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  number_of_seasons: number;
  streamingPlatforms?: string[];
  status?: string;
  first_air_date: string;
  networks?: { id: number; name: string; logo_path: string }[];
};

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime?: number;
}


export type SeriesFilterParams = {
    page: number;
    sortBy: string;
    selectedGenre: string;
    selectedProvider: string;
    classification: string;
    searchTerm: string;
    minRating: number;
    maxRating: number;
    selectedCountry: string;
    mainProviderIds?: string;
  };