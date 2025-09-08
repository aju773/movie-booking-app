import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUpcoming } from '../../utils/tmdb'
import MovieGrid from '../../components/MovieGrid/MovieGrid'
import MovieRail from '../../components/MovieRail/MovieRail'

export default function Upcoming({ compact = false }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchUpcoming().then(d => {
      if (!alive) return
      setMovies(d.results || [])
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const handleClick = (id) => navigate(`/movie/${id}`)

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

  if (compact) return <MovieRail movies={movies} title="Upcoming" cardWidth={180} renderCard={renderCard} />

  return (
    <div className="page">
      <div className="page-center">
        <h2 className="h2">Upcoming</h2>
        {loading ? <div className="muted">Loading…</div> :
          <MovieGrid movies={movies} renderCard={renderCard} />}
      </div>
    </div>
  )
}
