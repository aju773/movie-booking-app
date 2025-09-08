import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import HeroCarousel from './components/HeroCarousel/HeroCarousel'
import NowPlaying from './Pages/NowPlaying/NowPlaying'
import Upcoming from './Pages/Upcoming/Upcoming'
import Footer from './components/Footer/Footer'
import Auth from './Pages/Auth/Auth'
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
