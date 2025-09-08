import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './Ticket.css';
import { getBooking, cancelBooking } from '../../utils/Bookings';

export default function Ticket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const t = await getBooking(id);
      setTicket(t);
    } catch (e) {
      console.error(e);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const onCancel = async () => {
    if (!ticket) return;
    const ok = window.confirm("Cancel this booking? This cannot be undone.");
    if (!ok) return;
    setBusy(true);
    try {
      await cancelBooking(ticket.id);
      // re-fetch updated booking
      const updated = await getBooking(ticket.id);
      setTicket(updated);
      alert("Booking cancelled");
    } catch (e) {
      console.error(e);
      alert("Cancellation failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="muted">Loading ticket…</div>;
  if (!ticket) return <div className="muted">Ticket not found.</div>;

  const isCancelled = (ticket.status || ticket.state || '').toUpperCase() === 'CANCELLED';

  return (
    <div className="ticket-container">
      <div className={`ticket-card ${isCancelled ? 'cancelled' : ''}`}>
        <div className="ticket-header">
          <h3>{ticket.movie_title}</h3>
          <span title={new Date(ticket.created_at || ticket.booked_at || Date.now()).toString()}>
            {new Date(ticket.created_at || ticket.booked_at || Date.now()).toLocaleDateString()} {new Date(ticket.created_at || ticket.booked_at || Date.now()).toLocaleTimeString()}
          </span>
        </div>

        <div className="ticket-body">
          <div className={`status-pill ${isCancelled ? 'danger' : 'ok'}`}>
            {isCancelled ? 'Cancelled' : 'Confirmed'}
          </div>

          <div><strong>Seats:</strong> {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ''}</div>
          <div><strong>Amount:</strong> ₹{Number(ticket.total_amount ?? ticket.totalPrice ?? 0).toFixed(2)}</div>
          <div><strong>Code:</strong> {ticket.booking_code || ticket.bookingCode || ''}</div>
        </div>

        <div className="ticket-qr">
          <div className={isCancelled ? 'qr-disabled' : ''}>
            <QRCodeCanvas value={String(ticket.booking_code || ticket.id)} size={120} />
          </div>
        </div>

        {!isCancelled && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn" disabled={busy} onClick={onCancel}>Cancel Booking</button>
          </div>
        )}
      </div>
    </div>
  );
}
