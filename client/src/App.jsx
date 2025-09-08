import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import HeroCarousel from './components/HeroCarousel/HeroCarousel'
import NowPlaying from './pages/NowPlaying/NowPlaying'
import Upcoming from './pages/Upcoming/Upcoming'
import Footer from './components/Footer/Footer'
import Auth from './pages/Auth/Auth'
import MovieDetail from './pages/MovieDetail/MovieDetail'
import SearchResults from './pages/SearchResults/SearchResults'
import Booking from './pages/Booking/Booking'
import MyBookings from './pages/MyBookings/MyBookings'
import Ticket from './pages/Ticket/Ticket'
import ProtectedRoute from './utils/ProtectedRoute'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-playing" element={<NowPlaying />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/ticket/:id" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
          {/* Django Admin is separate: http://127.0.0.1:8000/admin/ */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}


function Home() {
  return (
    <>
      <HeroCarousel />
      <div className="container section">
        <section>
          <h2 className="h2">Now Playing</h2>
          <NowPlaying compact />
        </section>

        <section>
          <h2 className="h2">Upcoming</h2>
          <Upcoming compact />
        </section>
      </div>
    </>
  )
}
