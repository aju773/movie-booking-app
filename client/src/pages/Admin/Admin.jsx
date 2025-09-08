import React, { useEffect, useState } from 'react'

const API = 'http://localhost:3001'

export default function Admin(){
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title:'', poster:'', releaseDate:'', genre:'', rating:'' })
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    try{
      const [m, u] = await Promise.all([
        fetch(`${API}/movies`).then(r=>r.json()),
        fetch(`${API}/users`).then(r=>r.json())
      ])
      setMovies(m); setUsers(u)
    }catch(e){
      setErr('Failed to load admin data. Is json-server running on :3001?')
    }
  }

  useEffect(()=>{ load() }, [])

  const reset = () => { setForm({ title:'', poster:'', releaseDate:'', genre:'', rating:'' }); setEditingId(null) }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try{
      const payload = { ...form, rating: Number(form.rating || 0) }
      if(editingId){
        await fetch(`${API}/movies/${editingId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: editingId, ...payload }) })
      }else{
        await fetch(`${API}/movies`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      }
      reset()
      await load()
    }catch(e){ setErr('Save failed') }
    finally{ setBusy(false) }
  }

  const edit = (m) => {
    setEditingId(m.id)
    setForm({ title:m.title || '', poster:m.poster || '', releaseDate:m.releaseDate || '', genre:m.genre || '', rating: String(m.rating ?? '') })
  }

  const del = async (id) => {
    if(!confirm('Delete this movie?')) return
    setBusy(true)
    try{
      await fetch(`${API}/movies/${id}`, { method:'DELETE' })
      await load()
    }finally{ setBusy(false) }
  }

  return (
    <div className="container section">
      <h2 className="h2">Admin Panel</h2>
      {err && <div className="card" style={{ padding: 12, marginBottom: 12 }}>{err}</div>}

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} required />
          <input className="input" placeholder="Poster URL" value={form.poster} onChange={e=>setForm(f=>({...f, poster:e.target.value}))} />
          <input className="input" placeholder="Release Date (YYYY-MM-DD)" value={form.releaseDate} onChange={e=>setForm(f=>({...f, releaseDate:e.target.value}))} />
          <input className="input" placeholder="Genre" value={form.genre} onChange={e=>setForm(f=>({...f, genre:e.target.value}))} />
          <input className="input" placeholder="Rating (0-10)" value={form.rating} onChange={e=>setForm(f=>({...f, rating:e.target.value}))} />
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn primary" disabled={busy} type="submit">{editingId ? 'Update' : 'Create'}</button>
            <button className="btn" disabled={busy} type="button" onClick={reset}>Clear</button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ background:'var(--bg-elev-2)' }}>
            <tr>
              <th style={th}>Poster</th>
              <th style={th}>Title</th>
              <th style={th}>Release</th>
              <th style={th}>Genre</th>
              <th style={th}>Rating</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id} style={{ borderTop: `1px solid var(--border)` }}>
                <td style={td}><img src={m.poster} alt={m.title} style={{ width:56, height:84, objectFit:'cover', borderRadius:8 }}/></td>
                <td style={td}>{m.title}</td>
                <td style={td}>{m.releaseDate || '—'}</td>
                <td style={td}>{m.genre || '—'}</td>
                <td style={td}>{m.rating ?? '—'}</td>
                <td style={{ ...td, textAlign:'right' }}>
                  <button className="btn" onClick={()=>edit(m)}>Edit</button>{' '}
                  <button className="btn" onClick={()=>del(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr><td style={{ ...td, textAlign:'center' }} colSpan="6">No movies yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop:0 }}>Users</h3>
        <ul style={{ margin:0, paddingLeft: 18 }}>
          {users.map(u => <li key={u.id}>{u.name} — <span className="muted">{u.email}</span></li>)}
        </ul>
      </div>
    </div>
  )
}

const th = { textAlign:'left', padding:'12px' }
const td = { padding:'12px', verticalAlign:'top' }
