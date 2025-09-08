import React from 'react'
import { Link } from 'react-router-dom'
import './MovieGrid.css'

export default function MovieGrid({ movies = [] }){
  return (
    <div className="grid">
      {movies.map(m => (
        <Link to={`/movie/${m.id}`} key={m.id} className="card-movie">
          <img
            src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : m.poster}
            alt={m.title}
          />
          <div className="meta">
            <div className="title">{m.title}</div>
            <div className="sub">{(m.release_date || m.releaseDate || 'TBA').slice(0,10)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
