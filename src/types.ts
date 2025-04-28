// src/types.ts
export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
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
  
export type Series = {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  number_of_seasons: number;
  streamingPlatforms?: string[];
};

export type Episode = {
    episode_number: number;
    name: string;
    overview: string;
  };

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