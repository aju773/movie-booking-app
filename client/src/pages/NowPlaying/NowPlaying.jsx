import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNowPlaying } from '../../utils/tmdb'
import MovieGrid from '../../components/MovieGrid/MovieGrid'
import MovieRail from '../../components/MovieRail/MovieRail'
import './NowPlaying.css'

export default function NowPlaying({ compact = false }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    fetchNowPlaying()
      .then(data => {
        if (!alive) return
        setMovies(data.results || [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load'); setLoading(false) })
    return () => { alive = false }
  }, [])

  const handleClick = (id) => navigate(`/movie/${id}`)

  // Inline card renderer for rail or grid
  const renderCard = (m) => {
    const poster = m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : (m.poster || '')
    return (
      <div className="card-movie" onClick={() => handleClick(m.id)} style={{ cursor: 'pointer' }}>
        <img src={poster} alt={m.title} />
        <div className="meta">
          <div className="title">{m.title}</div>
          <div className="sub">{(m.release_date || m.releaseDate || 'TBA').slice(0,10)}</div>
        </div>
      </div>
    )
  }

  if (compact) return <MovieRail movies={movies} title="Now Playing" cardWidth={180} renderCard={renderCard} />

  return (
    <div className="page">
      <div className="center">
        <h2 className="heading">Now Playing</h2>
        {loading ? <div className="muted">Loading…</div> :
          error ? <div className="muted">{error}</div> :
            <MovieGrid movies={movies} renderCard={renderCard} />}
      </div>
    </div>
  )
}

