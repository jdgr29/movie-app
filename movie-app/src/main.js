// src/main.js
import './style.css';
import { fetchMovies, fetchMovieDetails, fetchPopularMovies } from './api';
import { displayMovies, displayMovieDetails, displayFavoriteMovies } from './ui';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieListContainer = document.getElementById('movie-list');
const movieDetailsContainer = document.getElementById('movie-details');
const favoritesListContainer = document.getElementById('favorites-list'); // Added

let favorites = [];
let currentDisplayedMovies = []; // To keep track of movies in the main list

// --- Favorites Management ---
function saveFavorites() {
  localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

async function addFavorite(movieId) {
  const movie = await fetchMovieDetails(movieId);
  if (movie && !favorites.some(fav => fav.id === movie.id)) {
    favorites.push(movie);
    saveFavorites();
    displayFavoriteMovies(favorites);
    // Re-render the main movie list to update button states
    displayMovies(currentDisplayedMovies, favorites);
  }
}

function removeFavorite(movieId) {
  // MovieId from dataset is a string, ensure comparison is correct or parse it
  const idToRemove = parseInt(movieId, 10);
  favorites = favorites.filter(movie => movie.id !== idToRemove);
  saveFavorites();
  displayFavoriteMovies(favorites);
  // Re-render the main movie list to update button states
  displayMovies(currentDisplayedMovies, favorites);
}

function loadFavorites() {
  const storedFavorites = localStorage.getItem('movieFavorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
  }
  displayFavoriteMovies(favorites);
}

// --- Event Listeners ---
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  movieDetailsContainer.innerHTML = ''; // Clear details on new search
  const query = searchInput.value.trim();
  if (query === '') {
    // If search is empty, display popular movies again
    const popularMovies = await fetchPopularMovies();
    currentDisplayedMovies = popularMovies; // Update current list
    displayMovies(popularMovies, favorites);
    return;
  }
  const movies = await fetchMovies(query);
  currentDisplayedMovies = movies; // Update current list
  displayMovies(movies, favorites);
});

movieListContainer.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.classList.contains('add-favorite-btn')) {
    const movieId = target.dataset.movieId;
    await addFavorite(movieId);
  } else {
    const movieCard = target.closest('.movie-card');
    if (movieCard) {
      const movieId = movieCard.dataset.id;
      const movie = await fetchMovieDetails(movieId);
      displayMovieDetails(movie);
    }
  }
});

if (favoritesListContainer) {
  favoritesListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-favorite-btn')) {
      const movieId = event.target.dataset.movieId;
      removeFavorite(movieId);
    }
  });
}

// --- Initial Load ---
window.addEventListener('DOMContentLoaded', async () => {
  loadFavorites(); // Load favorites first
  const popularMovies = await fetchPopularMovies();
  currentDisplayedMovies = popularMovies; // Set initial list
  displayMovies(popularMovies, favorites); // Display popular movies with favorite status
  if (movieDetailsContainer) {
    movieDetailsContainer.innerHTML = '';
  }
});
