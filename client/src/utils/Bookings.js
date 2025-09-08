import API from "./apiClient";

/**
 * Booking helpers that use your existing axios client (apiClient.js).
 * The axios client already attaches access token and handles refresh.
 */

export async function createBooking(payload) {
  // POST /bookings/ -> returns created booking object
  const res = await API.post("/bookings/", payload);
  return res.data;
}

export async function getBooking(id) {
  const res = await API.get(`/bookings/${id}/`);
  return res.data;
}

export async function cancelBooking(id, reason = "") {
  // POST /bookings/:id/cancel/
  const res = await API.post(`/bookings/${id}/cancel/`, { reason });
  return res.data;
}

export async function getMyBookings(includeCancelled = false) {
  const res = await API.get(`/bookings/mine/?include_cancelled=${includeCancelled ? "true" : "false"}`);
  return res.data;
}
