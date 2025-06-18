import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Heart,
  Shield,
  Clock,
  Users
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Asesmen Diet', path: '/assessment' },
      { name: 'Rekomendasi', path: '/recommendations' },
      { name: 'Riwayat', path: '/history' },
      { name: 'Dashboard', path: '/dashboard' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' }
    ],
    resources: [
      { name: 'Help Center', path: '/help' },
      { name: 'Documentation', path: '/docs' },
      { name: 'API Reference', path: '/api-docs' },
      { name: 'Status', path: '/status' }
    ]
  };

  const features = [
    { icon: Shield, text: 'Data Aman & Terpercaya' },
    { icon: Clock, text: 'Asesmen Cepat 3 Menit' },
    { icon: Users, text: 'Rekomendasi Personal' },
    { icon: Heart, text: 'Berbasis Standar Medis' }
  ];

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <Activity className="logo-icon" />
                <span className="logo-text">Diet Assessment</span>
              </Link>
              <p className="footer-description">
                Platform terpercaya untuk asesmen diet dan rekomendasi makanan sehat 
                yang dipersonalisasi sesuai kondisi kesehatan dan tujuan Anda.
              </p>
              
              {/* Features */}
              <div className="footer-features">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="feature-item">
                      <IconComponent size={16} />
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>support@dietassessment.com</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+62 123 456 7890</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Surabaya, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="link-group">
                <h3 className="link-title">Product</h3>
                <ul className="link-list">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-title">Company</h3>
                <ul className="link-list">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-title">Resources</h3>
                <ul className="link-list">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Dapatkan tips diet dan update terbaru dari kami
              </p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </form>
              
              {/* Social Links */}
              <div className="social-links">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-link" aria-label="GitHub">
                    <Github size={20} />
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="social-link" aria-label="Email">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                © {currentYear} Diet Assessment App. Made with{' '}
                <Heart size={14} className="heart-icon" /> by{' '}
                <strong>Fausta Irsyad Ramadhan</strong> (5026211150)
              </p>
              <p className="course-info">
                PPS (A) - Pemrograman Perangkat Sistem
              </p>
            </div>
            
            <div className="footer-bottom-links">
              <Link to="/privacy" className="bottom-link">Privacy</Link>
              <Link to="/terms" className="bottom-link">Terms</Link>
              <Link to="/contact" className="bottom-link">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--text-primary);
          color: white;
          margin-top: auto;
        }

        .footer-main {
          padding: 60px 0 40px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 40px;
        }

        .footer-brand {
          max-width: 350px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .logo-icon {
          color: var(--primary-color);
        }

        .footer-description {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 24px;
        }

        .footer-features {
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .feature-item svg {
          color: var(--primary-color);
        }

        .contact-info {
          margin-top: 20px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .contact-item svg {
          color: var(--primary-color);
        }

        .footer-links {
          display: contents;
        }

        .link-group {
          margin-bottom: 24px;
        }

        .link-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: white;
        }

        .link-list {
          list-style: none;
          padding: 0;
        }

        .link-list li {
          margin-bottom: 8px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: var(--primary-color);
        }

        .footer-newsletter {
          max-width: 300px;
        }

        .newsletter-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .newsletter-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          margin-bottom: 24px;
        }

        .newsletter-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px 0 0 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .newsletter-button {
          padding: 10px 16px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 0 6px 6px 0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .newsletter-button:hover {
          background: var(--primary-dark);
        }

        .social-links h4 {
          font-size: 14px;
          margin-bottom: 12px;
          color: white;
        }

        .social-icons {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px 0;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .copyright p {
          margin-bottom: 4px;
        }

        .course-info {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .heart-icon {
          color: #e53e3e;
          display: inline;
          vertical-align: middle;
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .bottom-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .bottom-link:hover {
          color: var(--primary-color);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }

          .footer-brand {
            grid-column: 1 / -1;
            max-width: none;
          }

          .footer-newsletter {
            grid-column: 1 / -1;
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .footer-main {
            padding: 40px 0 30px;
          }

          .footer-bottom-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .footer-bottom-links {
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-brand {
            text-align: center;
          }

          .newsletter-form {
            flex-direction: column;
            gap: 8px;
          }

          .newsletter-input {
            border-radius: 6px;
          }

          .newsletter-button {
            border-radius: 6px;
          }

          .social-icons {
            justify-content: center;
          }

          .footer-bottom-links {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;