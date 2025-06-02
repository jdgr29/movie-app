// src/api.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovies(query) {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return []; // Return empty array on error
  }
}

export async function fetchMovieDetails(movieId) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null; // Return null on error
  }
}

export async function fetchPopularMovies() {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return []; // Return empty array on error
  }
}
