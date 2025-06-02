// src/api.ts
import axios from 'axios';

const API_KEY: string | undefined = import.meta.env.VITE_API_KEY;
const BASE_URL: string = 'https://api.themoviedb.org/3';

// --- Interfaces for TMDB API responses ---
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[]; // For movie list
  genres?: { id: number; name: string }[]; // For movie details
}

interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// --- API Functions ---
export async function fetchMovies(query: string): Promise<Movie[]> {
  if (!API_KEY) {
    console.error('API Key is missing');
    return [];
  }
  try {
    const response = await axios.get<MovieListResponse>(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: string): Promise<Movie | null> {
  if (!API_KEY) {
    console.error('API Key is missing');
    return null;
  }
  try {
    // Movie details response is directly a Movie object
    const response = await axios.get<Movie>(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  if (!API_KEY) {
    console.error('API Key is missing');
    return [];
  }
  try {
    const response = await axios.get<MovieListResponse>(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}
