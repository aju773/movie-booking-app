import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './TicketCard.css'; // make sure your CSS exists

export default function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <div className="ticket-header">{ticket.movieTitle}</div>
      <div className="ticket-body">
        <div><strong>Name:</strong> {ticket.userName}</div>
        <div><strong>Seats:</strong> {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ''}</div>
        <div><strong>Total:</strong> ₹{ticket.totalPrice}</div>
        <div><strong>Date:</strong> {new Date(ticket.date).toLocaleDateString()}</div>
        <div><strong>Time:</strong> {new Date(ticket.date).toLocaleTimeString()}</div>
        <div className="ticket-qr">
          <QRCodeCanvas value={String(ticket.id)} size={80} />
        </div>
      </div>
    </div>
  );
}
