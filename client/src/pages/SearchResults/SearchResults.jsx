import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchNowPlaying, fetchUpcoming } from '../../utils/tmdb'
import MovieGrid from '../../components/MovieGrid/MovieGrid'
import './SearchResults.css'

export default function SearchResults(){
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const [movies, setMovies] = useState([])

  useEffect(()=>{
    Promise.all([fetchNowPlaying(), fetchUpcoming()]).then(([a,b])=>{
      const all = [...(a.results||[]), ...(b.results||[])]
      const filtered = all.filter(m => (m.title || '').toLowerCase().includes(q))
      setMovies(filtered)
    })
  }, [q])

  return (
    <div className="container section">
      <div className="query muted">Results for: <strong>{q}</strong></div>
      <MovieGrid movies={movies} />
    </div>
  )
}
