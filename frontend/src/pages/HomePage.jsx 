import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Target, Shield, Heart, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Clock,
      title: 'Asesmen Cepat',
      description: 'Hanya memakan waktu kurang dari 3 menit untuk mendapatkan hasil lengkap'
    },
    {
      icon: Target,
      title: 'Personalisasi',
      description: 'Rekomendasi makanan sesuai tujuan diet dan kondisi kesehatan Anda'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Berdasarkan standar medis dan panduan nutrisi yang terpercaya'
    },
    {
      icon: Heart,
      title: 'Kesehatan Optimal',
      description: 'Membantu mencapai berat badan ideal dan gaya hidup sehat'
    }
  ];

  const stats = [
    { number: '95', label: 'Assessment Selesai', sublabel: 'dari 120 pengguna' },
    { number: '79.17%', label: 'Success Rate', sublabel: 'tingkat keberhasilan' },
    { number: '90', label: 'Pesanan Berhasil', sublabel: 'dari 100 pesanan' },
    { number: '13.57', label: 'Assessment/Hari', sublabel: 'rata-rata harian' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title fade-in">
                Selamat Datang Di <span className="text-gradient">Asesmen Diet</span>
              </h1>
              <p className="hero-description fade-in">
                Kami akan membantu Anda menentukan program yang sesuai bagi Anda. 
                Isi semua pertanyaan dengan sebenar-benarnya untuk keakuratan program. 
                Sudah siap melakukan test?
              </p>
              <div className="hero-actions fade-in">
                <Link to="/assessment" className="btn btn-primary btn-large">
                  Mulai Asesmen
                  <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn btn-secondary btn-large">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
              <div className="hero-note">
                <Clock size={16} />
                <span>Hanya memakan waktu kurang dari 3 menit</span>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="visual-card">
                <div className="card-icon">
                  <Heart size={48} className="text-primary" />
                </div>
                <h3>Kesehatan Anda</h3>
                <p>Prioritas Utama</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Mengapa Pilih Diet Assessment?</h2>
            <p className="section-description">
              Platform terpercaya untuk asesmen diet dan rekomendasi makanan sehat
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-card slide-in-right">
                  <div className="feature-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Statistik Platform</h2>
            <p className="section-description">
              Data real-time performa dan kepuasan pengguna
            </p>
          </div>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sublabel">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Siap Memulai Perjalanan Sehat Anda?</h2>
              <p className="cta-description">
                Dapatkan rekomendasi diet yang dipersonalisasi sesuai kondisi kesehatan dan tujuan Anda
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/assessment" className="btn btn-primary btn-large">
                Mulai Asesmen Sekarang
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 100px 0 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><polygon points="1000,100 1000,0 0,100"/></svg>');
          background-size: cover;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .text-gradient {
          background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 20px;
          line-height: 1.6;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .hero-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          opacity: 0.8;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visual-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          transform: translateY(20px);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(20px); }
          50% { transform: translateY(0px); }
        }

        .card-icon {
          margin-bottom: 20px;
        }

        .visual-card h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .visual-card p {
          font-size: 16px;
          opacity: 0.8;
        }

        /* Features Section */
        .features-section {
          padding: 80px 0;
          background: var(--background-white);
        }

        .section-header {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .section-description {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: var(--background-white);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: var(--primary-color);
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .feature-description {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 0;
          background: var(--background-light);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }

        .stat-card {
          background: var(--background-white);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-number {
          font-size: 36px;
          font-weight: 800;
          color: var(--primary-color);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-sublabel {
          font-size: 14px;
          color: var(--text-secondary);
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
        }

        .cta-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .cta-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-description {
          font-size: 18px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .cta-actions .btn {
          background: white;
          color: var(--primary-color);
        }

        .cta-actions .btn:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-description {
            font-size: 18px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .section-title {
            font-size: 28px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-content {
            flex-direction: column;
            text-align: center;
          }

          .cta-title {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 28px;
          }

          .hero-description {
            font-size: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .visual-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;