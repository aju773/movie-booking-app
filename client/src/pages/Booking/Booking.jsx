import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatSelector from '../../components/SeatSelector/SeatSelector';
import { fetchMovieDetails } from '../../utils/tmdb';
import { createBooking } from '../../utils/Bookings';

export default function Booking() {
  const { id } = useParams();                 // TMDB movie id (string)
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const pricePerSeat = 180;
  const fee = 20; // convenience fee (example)
  const subTotal = useMemo(() => selected.length * pricePerSeat, [selected]);
  const total = useMemo(() => subTotal + (selected.length ? fee : 0), [subTotal]);

  useEffect(() => {
    let alive = true;
    fetchMovieDetails(id)
      .then((m) => { if (alive) setMovie(m); })
      .catch(() => alert('Failed to load movie from TMDB'))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const toggle = (n) => {
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  };

  const book = async () => {
    if (!selected.length) return alert('Select at least one seat');
    const access = localStorage.getItem('access') || localStorage.getItem('token') || null;
    if (!access) return alert('Please login first');

    const payload = {
      movie_id: String(movie.id),
      movie_title: movie.title,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '',
      theatre: "Demo Theatre",            // later: let user choose a theatre/showtime
      screen: "Screen 1",
      language: movie.original_language?.toUpperCase() || "",
      format: "2D",
      show_date: new Date().toISOString().slice(0,10),
      show_time: new Date().toTimeString().slice(0,8),
      seat_category: "Premium",
      seats: selected,
      price_per_seat: pricePerSeat,
      convenience_fee: selected.length ? fee : 0,
      total_amount: total
    };

    try {
      const saved = await createBooking(payload);
      // saved.id should be the booking primary key (uuid or integer)
      navigate(`/ticket/${saved.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save booking. Make sure the backend is running and you are logged in.');
    }
  };

  if (loading) return <div className="muted">Loading movie...</div>;
  if (!movie) return <div className="muted">Movie not found.</div>;

  return (
    <div className="container section">
      <h2 className="h2">{movie.title} — Select Seats</h2>
      <SeatSelector selected={selected} onToggle={toggle} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <div className="card" style={{ padding: 10 }}>Total: ₹{total.toFixed(2)}</div>
        <button className="btn primary" disabled={!selected.length} onClick={book}>Book</button>
      </div>
    </div>
  );
}
