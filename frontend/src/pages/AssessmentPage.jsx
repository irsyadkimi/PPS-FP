import React, { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import { useNavigate } from "react-router-dom";
import assessmentAPI from "../services/api";
import { Clock, Shield, Target } from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      const result = await assessmentAPI.submitAssessment(payload);
      if (result.error) {
        throw new Error(result.message);
      }
      navigate('/results');
    } catch (error) {
      console.error("Assessment submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const benefits = [
    {
      icon: Clock,
      title: 'Cepat & Mudah',
      description: 'Hanya 3 menit untuk hasil lengkap'
    },
    {
      icon: Target,
      title: 'Personalisasi',
      description: 'Rekomendasi sesuai kondisi Anda'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Berdasarkan standar medis terkini'
    }
  ];

  return (
    <div className="assessment-page">
      {/* Header Section */}
      <div className="assessment-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">Asesmen Diet untuk Personalisasi Makanan</h1>
            <p className="page-description">
              Dapatkan rekomendasi makanan sehat yang disesuaikan dengan tujuan diet dan kondisi kesehatan Anda
            </p>
            
            <div className="benefits-grid">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="benefit-text">
                      <h3 className="benefit-title">{benefit.title}</h3>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      <div className="assessment-content">
        <AssessmentForm onSubmit={handleSubmit} />
      </div>

      {/* Footer Note */}
      <div className="assessment-footer">
        <div className="container">
          <div className="footer-note">
            <p>
              * Hasil asesmen ini bersifat informatif dan tidak menggantikan konsultasi medis profesional. 
              Untuk kondisi kesehatan khusus, disarankan untuk berkonsultasi dengan dokter atau ahli gizi.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .assessment-page {
          min-height: 100vh;
          background: var(--background-light);
        }

        .assessment-header {
          background: white;
          padding: 40px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .header-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-description {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 20px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--background-light);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .benefit-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .benefit-text {
          text-align: left;
        }

        .benefit-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .benefit-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .assessment-content {
          padding: 60px 0;
        }

        .assessment-footer {
          background: white;
          padding: 30px 0;
          border-top: 1px solid var(--border-color);
        }

        .footer-note {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .footer-note p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
          font-style: italic;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: 28px;
          }

          .page-description {
            font-size: 16px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .benefit-item {
            flex-direction: column;
            text-align: center;
          }

          .benefit-text {
            text-align: center;
          }

          .assessment-content {
            padding: 40px 0;
          }
        }

        @media (max-width: 480px) {
          .assessment-header {
            padding: 20px 0;
          }

          .page-title {
            font-size: 24px;
          }

          .benefits-grid {
            gap: 16px;
          }

          .benefit-item {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AssessmentPage;