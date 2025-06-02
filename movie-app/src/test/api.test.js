import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { fetchPopularMovies, fetchMovies, fetchMovieDetails } from '../api'; // Adjust path as needed
import { server } from './mocks/server'; // MSW server
import { http, HttpResponse } from 'msw';

// The VITE_API_KEY will be automatically picked up by Vite's env handling for tests
// For the purpose of these tests, the actual value of import.meta.env.VITE_API_KEY
// will be 'TEST_API_KEY' because of how msw handlers are set up to check for it.
// If it were not, Vite would make `import.meta.env.VITE_API_KEY` available from `.env`
// or `.env.test` if you created one. Our handlers expect 'TEST_API_KEY'.

describe('TMDB API Functions', () => {

  // Test fetchPopularMovies
  it('fetchPopularMovies should return popular movies', async () => {
    const movies = await fetchPopularMovies();
    expect(movies).toBeInstanceOf(Array);
    expect(movies.length).toBeGreaterThan(0);
    expect(movies[0].title).toBe('Mock Popular Movie 1');
  });

  it('fetchPopularMovies should return an empty array on API error', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/popular', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const movies = await fetchPopularMovies();
    expect(movies).toEqual([]);
  });

  // Test fetchMovies (search)
  it('fetchMovies should return search results for a query', async () => {
    const movies = await fetchMovies('fight club');
    expect(movies).toBeInstanceOf(Array);
    expect(movies.length).toBeGreaterThan(0);
    expect(movies[0].title).toBe('Mock Fight Club');
  });

  it('fetchMovies should return an empty array for a query with no results', async () => {
    const movies = await fetchMovies('non existent query');
    expect(movies).toEqual([]);
  });

  it('fetchMovies should return an empty array on API error', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/search/movie', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const movies = await fetchMovies('any query');
    expect(movies).toEqual([]);
  });

  // Test fetchMovieDetails
  it('fetchMovieDetails should return movie details for a valid ID', async () => {
    const movie = await fetchMovieDetails('1'); // Assuming '1' is a valid ID in mocks
    expect(movie).toBeInstanceOf(Object);
    expect(movie.title).toBe('Mock Popular Movie 1 Details');
  });

  it('fetchMovieDetails should return null for an invalid ID', async () => {
    const movie = await fetchMovieDetails('invalid_id');
    expect(movie).toBeNull();
  });

  it('fetchMovieDetails should return null on API error', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/:movieId', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const movie = await fetchMovieDetails('1');
    expect(movie).toBeNull();
  });
});
