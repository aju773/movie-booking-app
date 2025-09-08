import { useState } from "react";
import './Auth.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export default function AuthTabs() {
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        await axios.post(`${API_BASE}/register/`, {
          username: form.username, email: form.email, password: form.password
        });
        alert("Signup successful! Please login.");
        setTab("login");
        setForm({ username: "", email: "", password: "" });
        setLoading(false);
        return;
      }
      // login
      const res = await axios.post(`${API_BASE}/token/`, {
        username: form.username, password: form.password
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("auth_user", JSON.stringify({ username: form.username, email: form.email || "" }));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Auth failed. Check credentials & backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-tabs">
        <div onClick={() => setTab("login")} className={`auth-tab ${tab === "login" ? "active" : ""}`}>Login</div>
        <div onClick={() => setTab("signup")} className={`auth-tab ${tab === "signup" ? "active" : ""}`}>Signup</div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {tab === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        )}
        {tab === "login" && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        )}
        {tab === "signup" && (
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : tab === "login" ? "Login" : "Signup"}
        </button>
      </form>
    </div>
  );
}
