import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [authUser, setAuthUser] = useState(null);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    const u = localStorage.getItem('auth_user');
    setAuthUser(u ? JSON.parse(u) : null);
  }, [location]);

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )

  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('theme', t)
    setTheme(t)
  }

  const onSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('auth_user');
    setAuthUser(null);
    if (location.pathname.startsWith('/my-bookings')) navigate('/');
  }

  useEffect(() => {
    if (firstLoad.current) { firstLoad.current = false; return }
    const f = (e) => { if (e.key === 'theme' && e.newValue) applyTheme(e.newValue) }
    window.addEventListener('storage', f)
    return () => window.removeEventListener('storage', f)
  }, [])

  return (
    <nav className="navbar">
      <div className="container wrap">
        <Link to="/" className="brand">MYTHIX</Link>

        <form className="search" onSubmit={onSearch}>
          <input
            className="input search-input"
            placeholder="Search movies..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="btn search-btn" type="submit">Search</button>
        </form>

        <div className="nav-links">
          <NavLink to="/now-playing" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Now Playing</NavLink>
          <NavLink to="/upcoming" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Upcoming</NavLink>
          {authUser && <NavLink to="/my-bookings" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>My Bookings</NavLink>}

          <button
            className="theme-toggle"
            onClick={() => applyTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            <span className={`toggle-circle ${theme}`}></span>
          </button>

          {authUser ? (
            <div className="user-badge">
              <span>{(authUser.username || 'USER').toUpperCase()}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
