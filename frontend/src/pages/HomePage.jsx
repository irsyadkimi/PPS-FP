import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About</a>
          <div className="nav-dropdown">
            <a href="#" className="nav-link">Resources ⌄</a>
          </div>
          <a href="#" className="nav-link">Contact</a>
          <div className="nav-button">
            <span>pemesanan</span>
            <span>makanan</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h1 className="main-title">Selamat Datang</h1>
          <p className="main-subtitle">
            sebelum melakukan pemesanan makanan mohon lakukan asesmen 
            terlebih dahulu dengan klik tombol dibawah ini. asesmen hanya 
            memakan waktu kurang dari 3 menit
          </p>
          <Link to="/assessment" className="start-button">
            Mulai!!
          </Link>
        </div>
      </main>

      {/* Red frame decoration (from wireframe) */}
      <div className="red-frame"></div>
    </div>
  );
};

export default HomePage;
