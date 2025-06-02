// src/ui.js
const movieListContainer = document.getElementById('movie-list'); // Renamed for clarity in main.js
const movieDetailsContainer = document.getElementById('movie-details'); // Renamed for clarity in main.js
const favoritesListContainer = document.getElementById('favorites-list'); // Added for favorites

export function displayMovies(movies, favorites = []) {
  if (!movieListContainer) return;
  movieListContainer.innerHTML = '';
  movies.forEach(movie => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    const buttonText = isFavorite ? 'In Favorites' : 'Add to Favorites';
    const buttonDisabled = isFavorite ? 'disabled' : '';

    const movieCard = `
      <div class="movie-card" data-id="${movie.id}">
        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <button class="add-favorite-btn" data-movie-id="${movie.id}" ${buttonDisabled}>${buttonText}</button>
      </div>
    `;
    movieListContainer.innerHTML += movieCard;
  });
}

export function displayMovieDetails(movie) {
  if (!movieDetailsContainer) return;
  if (!movie) {
    movieDetailsContainer.innerHTML = '<p>Movie details not found.</p>';
    return;
  }
  movieDetailsContainer.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'}" alt="${movie.title}" style="max-width: 200px; margin-bottom: 10px;">
    <p>${movie.overview}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
    <p><strong>Genres:</strong> ${movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'N/A'}</p>
  `;
}

export function displayFavoriteMovies(favoriteMovies) {
  if (!favoritesListContainer) return;
  favoritesListContainer.innerHTML = '';
  if (favoriteMovies.length === 0) {
    favoritesListContainer.innerHTML = '<p>No favorite movies yet. Add some!</p>';
    return;
  }
  favoriteMovies.forEach(movie => {
    const movieCard = `
      <div class="movie-card favorite-card" data-id="${movie.id}">
        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <button class="remove-favorite-btn" data-movie-id="${movie.id}">Remove from Favorites</button>
      </div>
    `;
    favoritesListContainer.innerHTML += movieCard;
  });
}
