import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import './Footer.css'

export default function Footer() {
  return (
    <footer className="main-footer">
      {/* Top section */}
      <div className="container footer-top">
        {/* Left side - brand */}
        <div className="footer-brand">
          <strong>MYTHIX</strong>
          <div className="muted">Your simple, modern movie booking.</div>
        </div>

        {/* Right side - social icons */}
        <div className="footer-social">
          <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom section */}
      <div className="footer-bottom container">
        © 2025 MYTHIX. All rights reserved.
      </div>
    </footer>
  )
}
