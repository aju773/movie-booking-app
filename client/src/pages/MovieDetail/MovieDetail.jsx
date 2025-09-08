import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchMovieDetails } from '../../utils/tmdb'
import './MovieDetail.css'

export default function MovieDetail(){
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  useEffect(()=>{
    fetchMovieDetails(id).then(setMovie)
  }, [id])

  if(!movie) return <div className="container section muted">Loading…</div>

  const title = movie.title
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : movie.poster
  const release = movie.release_date || movie.releaseDate || 'TBA'
  const overview = movie.overview || '—'

  return (
    <div className="container section">
      <div className="detail">
        <div className="poster"><img src={poster} alt={title} /></div>
        <div className="meta">
          <h2 style={{ margin:0 }}>{title}</h2>
          <div className="muted">{release.slice(0,10)}</div>
          <p>{overview}</p>
          <div style={{ display:'flex', gap:8 }}>
            <Link to={`/booking/${id}`} className="btn primary">Book</Link>
            <Link to="/" className="btn">Back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
