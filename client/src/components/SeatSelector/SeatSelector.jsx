import React from 'react'
import './SeatSelector.css'

export default function SeatSelector({ selected = [], onToggle }){
  const seats = Array.from({ length: 50 }, (_, i)=> i+1)
  return (
    <div>
      <div className="legend">
        <span>Tap to select seats</span>
      </div>
      <div className="seats">
        {seats.map(n => {
          const isSel = selected.includes(n)
          return (
            <div
              key={n}
              className={'seat'+(isSel?' selected':'')}
              onClick={()=> onToggle(n)}
            >{n}</div>
          )
        })}
      </div>
    </div>
  )
}
