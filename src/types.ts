// src/types.ts
export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    genres?: { id: number; name: string }[];
  };
  
  export type TVShow = {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    number_of_seasons: number;
  };
  
  export type Episode = {
    episode_number: number;
    name: string;
    overview: string;
  };
  