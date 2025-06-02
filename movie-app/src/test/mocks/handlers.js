import { http, HttpResponse } from 'msw';

const API_KEY = 'TEST_API_KEY'; // Actual key doesn't matter for mocked responses
const BASE_URL = 'https://api.themoviedb.org/3';

export const handlers = [
  // Mock for fetching popular movies
  http.get(`${BASE_URL}/movie/popular`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('api_key') !== API_KEY) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    return HttpResponse.json({
      page: 1,
      results: [
        { id: 1, title: 'Mock Popular Movie 1', overview: 'Overview 1', poster_path: '/pop1.jpg', release_date: '2023-01-01', vote_average: 7.5 },
        { id: 2, title: 'Mock Popular Movie 2', overview: 'Overview 2', poster_path: '/pop2.jpg', release_date: '2023-01-02', vote_average: 8.0 },
      ],
      total_pages: 1,
      total_results: 2,
    });
  }),

  // Mock for searching movies
  http.get(`${BASE_URL}/search/movie`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('api_key') !== API_KEY) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    const query = url.searchParams.get('query');
    if (query === 'fight club') {
      return HttpResponse.json({
        page: 1,
        results: [
          { id: 3, title: 'Mock Fight Club', overview: 'Search result overview', poster_path: '/fightclub.jpg', release_date: '1999-10-15', vote_average: 8.4 },
        ],
        total_pages: 1,
        total_results: 1,
      });
    }
    return HttpResponse.json({ page: 1, results: [], total_pages: 0, total_results: 0 });
  }),

  // Mock for fetching movie details
  http.get(`${BASE_URL}/movie/:movieId`, ({ request, params }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('api_key') !== API_KEY) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }
    const { movieId } = params;
    if (movieId === '1') {
      return HttpResponse.json({ id: 1, title: 'Mock Popular Movie 1 Details', overview: 'Detailed overview 1', poster_path: '/detail1.jpg', release_date: '2023-01-01', vote_average: 7.5, genres: [{id: 28, name: "Action"}] });
    }
    if (movieId === '3') {
       return HttpResponse.json({ id: 3, title: 'Mock Fight Club Details', overview: 'Detailed search result', poster_path: '/fightclub_detail.jpg', release_date: '1999-10-15', vote_average: 8.4, genres: [{id: 18, name: "Drama"}] });
    }
    return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
  }),
];
