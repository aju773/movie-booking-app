const TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const KEY = import.meta.env.VITE_TMDB_KEY;
const BASE = 'https://api.themoviedb.org/3';

const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function fetchJson(url){
  try {
    const res = await fetch(url, { headers });
    if(!res.ok) throw new Error('TMDB fetch failed');
    return await res.json();
  } catch(e) {
    console.error('TMDB error:', e);
    return { results: [] };
  }
}

export function fetchNowPlaying(page=1){
  const qs = KEY ? `?language=en-US&page=${page}&api_key=${KEY}` : `?language=en-US&page=${page}`;
  return fetchJson(`${BASE}/movie/now_playing${qs}`);
}
export function fetchUpcoming(page=1){
  const qs = KEY ? `?language=en-US&page=${page}&api_key=${KEY}` : `?language=en-US&page=${page}`;
  return fetchJson(`${BASE}/movie/upcoming${qs}`);
}
export function fetchMovieDetails(id){
  const qs = KEY ? `?language=en-US&api_key=${KEY}` : `?language=en-US`;
  return fetchJson(`${BASE}/movie/${id}${qs}`);
}
