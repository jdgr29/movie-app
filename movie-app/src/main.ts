// src/main.ts
import './style.css';
import { fetchMovies, fetchMovieDetails, fetchPopularMovies, Movie } from './api'; // Import Movie type
import { displayMovies, displayMovieDetails, displayFavoriteMovies } from './ui';

// Type assertions for DOM elements
const searchForm = document.getElementById('search-form') as HTMLFormElement | null;
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
const movieListContainer = document.getElementById('movie-list') as HTMLDivElement | null;
const movieDetailsContainer = document.getElementById('movie-details') as HTMLDivElement | null;
const favoritesListContainer = document.getElementById('favorites-list') as HTMLDivElement | null;

let favorites: Movie[] = [];
let currentDisplayedMovies: Movie[] = [];

// --- Favorites Management ---
function saveFavorites(): void {
  localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

async function addFavorite(movieId: string): Promise<void> {
  const movie = await fetchMovieDetails(movieId);
  if (movie && !favorites.some(fav => fav.id === movie.id)) {
    favorites.push(movie);
    saveFavorites();
    displayFavoriteMovies(favorites);
    if (movieListContainer) { // Check if container exists
        displayMovies(currentDisplayedMovies, favorites);
    }
  }
}

function removeFavorite(movieId: string): void {
  const idToRemove = parseInt(movieId, 10);
  favorites = favorites.filter(movie => movie.id !== idToRemove);
  saveFavorites();
  displayFavoriteMovies(favorites);
  if (movieListContainer) { // Check if container exists
    displayMovies(currentDisplayedMovies, favorites);
  }
}

function loadFavorites(): void {
  const storedFavorites = localStorage.getItem('movieFavorites');
  if (storedFavorites) {
    try {
      favorites = JSON.parse(storedFavorites) as Movie[];
    } catch (e) {
      console.error("Error parsing favorites from localStorage", e);
      favorites = []; // Reset to empty if parsing fails
    }
  }
  displayFavoriteMovies(favorites);
}

// --- Event Listeners ---
searchForm?.addEventListener('submit', async (event: SubmitEvent) => {
  event.preventDefault();
  if (movieDetailsContainer) movieDetailsContainer.innerHTML = '';
  if (!searchInput) return;

  const query = searchInput.value.trim();
  if (query === '') {
    const popularMovies = await fetchPopularMovies();
    currentDisplayedMovies = popularMovies;
    displayMovies(popularMovies, favorites);
    return;
  }
  const movies = await fetchMovies(query);
  currentDisplayedMovies = movies;
  displayMovies(movies, favorites);
});

movieListContainer?.addEventListener('click', async (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('add-favorite-btn')) {
    const movieId = target.dataset.movieId;
    if (movieId) {
      await addFavorite(movieId);
    }
  } else {
    const movieCard = target.closest('.movie-card');
    if (movieCard instanceof HTMLElement && movieCard.dataset.id) {
      const movieId = movieCard.dataset.id;
      const movie = await fetchMovieDetails(movieId);
      displayMovieDetails(movie);
    }
  }
});

favoritesListContainer?.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('remove-favorite-btn')) {
    const movieId = target.dataset.movieId;
    if (movieId) {
      removeFavorite(movieId);
    }
  }
});

// --- Initial Load ---
window.addEventListener('DOMContentLoaded', async () => {
  loadFavorites();
  const popularMovies = await fetchPopularMovies();
  currentDisplayedMovies = popularMovies;
  displayMovies(popularMovies, favorites);
  if (movieDetailsContainer) {
    movieDetailsContainer.innerHTML = '';
  }
});
