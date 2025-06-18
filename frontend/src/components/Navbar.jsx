import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, Home, Info, BookOpen, Phone } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <Activity className="logo-icon" />
            <span className="logo-text">Diet Assessment</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="nav-cta desktop">
            <Link to="/assessment" className="btn btn-primary">
              Start Assessment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn mobile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/assessment"
              className="btn btn-primary mobile-cta"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 20px;
        }

        .logo-icon {
          color: var(--primary-color);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-link.active {
          color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-cta {
          display: flex;
          align-items: center;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .mobile-nav.open {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-nav-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
        }

        .mobile-cta {
          margin-top: 8px;
          justify-content: center;
        }

        .desktop {
          display: flex;
        }

        .mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop {
            display: none;
          }

          .mobile {
            display: block;
          }

          .mobile-nav {
            display: block;
          }

          .nav-content {
            padding: 12px 0;
          }

          .logo-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;