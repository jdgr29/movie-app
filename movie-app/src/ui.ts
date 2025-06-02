// src/ui.ts
import { Movie } from './api'; // Import the Movie interface

const movieListContainer = document.getElementById('movie-list') as HTMLDivElement | null;
const movieDetailsContainer = document.getElementById('movie-details') as HTMLDivElement | null;
const favoritesListContainer = document.getElementById('favorites-list') as HTMLDivElement | null;

export function displayMovies(movies: Movie[], favorites: Movie[] = []): void {
  if (!movieListContainer) return;
  movieListContainer.innerHTML = '';
  if (!movies || movies.length === 0) {
    movieListContainer.innerHTML = '<p>No movies found. Try a different search!</p>';
    return;
  }

  movies.forEach(movie => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    const buttonText = isFavorite ? 'In Favorites' : 'Add to Favorites';
    const buttonDisabled = isFavorite ? 'disabled' : '';
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/500x750.png?text=No+Image';

    const movieCard = `
      <div class="movie-card" data-id="${movie.id}">
        <img src="${posterUrl}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <button class="add-favorite-btn" data-movie-id="${movie.id}" ${buttonDisabled}>${buttonText}</button>
      </div>
    `;
    movieListContainer.innerHTML += movieCard;
  });
}

export function displayMovieDetails(movie: Movie | null): void {
  const movieDetailsSection = document.getElementById('movie-details-section');
  if (!movieDetailsContainer || !movieDetailsSection) return;

  // Reset and prepare for transition
  movieDetailsSection.classList.remove('loaded');
  movieDetailsContainer.innerHTML = ''; // Clear previous content immediately

  if (!movie) {
    movieDetailsContainer.innerHTML = '<p>Movie details not found.</p>';
    // Still trigger transition for the "not found" message to appear smoothly
    requestAnimationFrame(() => { // Ensures styles are applied before adding class
        movieDetailsSection.classList.add('loaded');
    });
    return;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';
  const genreNames = movie.genres && movie.genres.length > 0
    ? movie.genres.map(g => g.name).join(', ')
    : 'N/A';

  movieDetailsContainer.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${posterUrl}" alt="${movie.title}" style="max-width: 200px; margin-bottom: 10px;">
    <p>${movie.overview}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
    <p><strong>Genres:</strong> ${genreNames}</p>
  `;

  // Trigger the transition by adding the 'loaded' class
  // Use requestAnimationFrame to ensure the initial styles are applied before adding the class
  requestAnimationFrame(() => {
    movieDetailsSection.classList.add('loaded');
  });
}

export function displayFavoriteMovies(favoriteMovies: Movie[]): void {
  if (!favoritesListContainer) return;
  favoritesListContainer.innerHTML = '';
  if (!favoriteMovies || favoriteMovies.length === 0) {
    favoritesListContainer.innerHTML = '<p>No favorite movies yet. Add some!</p>';
    return;
  }
  favoriteMovies.forEach(movie => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/500x750.png?text=No+Image';

    const movieCard = `
      <div class="movie-card favorite-card" data-id="${movie.id}">
        <img src="${posterUrl}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <button class="remove-favorite-btn" data-movie-id="${movie.id}">Remove from Favorites</button>
      </div>
    `;
    favoritesListContainer.innerHTML += movieCard;
  });
}
