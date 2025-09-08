import React, { useRef } from 'react'
import './MovieRail.css'

export default function MovieRail({
  movies = [],
  title = '',
  cardWidth = 180,
  renderCard // optional function(m) => JSX for custom card
}) {
  const railRef = useRef(null)

  const scrollBy = (amount) => {
    if (!railRef.current) return
    railRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const defaultCard = (m) => {
    const poster = m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : (m.poster || '')
    return (
      <div className="mr-card" style={{ width: cardWidth }}>
        <img src={poster} alt={m.title} className="mr-poster" />
        <div className="mr-meta">
          <div className="mr-title">{m.title}</div>
          <div className="mr-sub">{(m.release_date || m.releaseDate || 'TBA').slice(0,10)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-rail">
      {title && <div className="mr-header"><h3>{title}</h3></div>}

      <div className="mr-wrap">
        <div className="mr-scroll h-scroll" ref={railRef} aria-label={`${title || 'Movies'} rail`}>
          {movies.map(m => (
            <div key={m.id} style={{ width: cardWidth }}>
              { renderCard ? renderCard(m) : defaultCard(m) }
            </div>
          ))}
        </div>

        <div className="rail-nav" aria-hidden={movies.length === 0}>
          <button aria-label="Previous" onClick={()=> scrollBy(- (cardWidth + 16))} className="rail-btn">‹</button>
          <button aria-label="Next" onClick={()=> scrollBy(cardWidth + 16)} className="rail-btn">›</button>
        </div>
      </div>
    </div>
  )
}
