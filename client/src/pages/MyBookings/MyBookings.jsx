import React, { useEffect, useState } from 'react';
import TicketCard from '../../components/TicketCard/TicketCard';
import { getMyBookings } from '../../utils/Bookings';
import { fetchMovieDetails } from '../../utils/tmdb';

export default function MyBookings() {
  const [tickets, setTickets] = useState([]);
  const access = localStorage.getItem('access') || localStorage.getItem('token');

  useEffect(() => {
    let alive = true;
    if (!access) return;

    const load = async () => {
      try {
        const data = await getMyBookings(false); // only confirmed by default

        // Hydrate titles if backend didn't include movie_title
        const enriched = await Promise.all(data.map(async (t) => {
          let movieTitle = t.movie_title || t.movieTitle || '';
          if (!movieTitle && t.movie_id) {
            try {
              const m = await fetchMovieDetails(t.movie_id);
              if (m?.title) movieTitle = m.title;
            } catch (e) { /* ignore */ }
          }
          const userRaw = localStorage.getItem('auth_user') || localStorage.getItem('user') || null;
          let userName = '';
          try { userName = userRaw ? JSON.parse(userRaw).name || JSON.parse(userRaw).username || '' : ''; } catch { userName = ''; }

          return {
            id: t.id,
            movieTitle: movieTitle || `Movie #${t.movie_id || 'unknown'}`,
            userName,
            seats: Array.isArray(t.seats) ? t.seats : (t.seat_list || []),
            totalPrice: t.total_amount ?? t.totalPrice ?? 0,
            date: t.created_at || t.booked_at || t.show_date || '',
            booking_code: t.booking_code || t.bookingCode || '',
          };
        }));

        if (alive) setTickets(enriched);
      } catch (e) {
        console.error(e);
        if (alive) setTickets([]);
      }
    };

    load();
    return () => { alive = false; };
  }, [access]);

  if (!access) return <div className="container section"><div className="muted">Please login to see your bookings.</div></div>;
  if (!tickets.length) return (
    <div className="container section">
      <h2 className="h2">My Bookings</h2>
      <div className="muted">No bookings yet.</div>
    </div>
  );

  return (
    <div className="container section">
      <h2 className="h2">My Bookings</h2>
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={{
          id: ticket.id,
          movieTitle: ticket.movieTitle,
          userName: ticket.userName,
          seats: ticket.seats,
          totalPrice: ticket.totalPrice,
          date: ticket.date,
          bookingCode: ticket.booking_code
        }} />
      ))}
    </div>
  );
}
