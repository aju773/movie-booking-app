import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNowPlaying } from '../../utils/tmdb';
import './HeroCarousel.css';

const FALLBACK = [
  { id: 'f1', title: 'Edge of Dawn', backdrop: 'https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg' },
  { id: 'f2', title: 'Silent Echoes', backdrop: 'https://image.tmdb.org/t/p/original/rjBmQ7YQZDYuC1vkpawuOa7dBDE.jpg' },
  { id: 'f3', title: 'Neon Circuit', backdrop: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' },
  { id: 'f4', title: 'Mocked Odyssey', backdrop: 'https://image.tmdb.org/t/p/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg' },
  { id: 'f5', title: 'Backup Plan', backdrop: 'https://image.tmdb.org/t/p/original/p1F51Lvj3sMopG948F5HsBbl43C.jpg' }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await fetchNowPlaying(1);
      if (!alive) return;
      const items = (data?.results || []).filter(r => r.backdrop_path).slice(0, 5);
      if (items.length) {
        setSlides(items.map(it => ({
          id: it.id,
          title: it.title,
          backdrop: `https://image.tmdb.org/t/p/original${it.backdrop_path}`
        })));
      } else {
        setSlides(FALLBACK);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="hero-carousel">
      <AnimatePresence>
        <motion.div
          key={slides[index].id}
          className="hero-slide-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <img className="hero-slide" src={slides[index].backdrop} alt={slides[index].title || 'Slide'} />
          <div className="hero-caption">
            <h2>{slides[index].title}</h2>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
