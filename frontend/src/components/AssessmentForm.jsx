import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/AssessmentForm';
import assessmentAPI from '../services/api';
import { Clock, Shield, Target } from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (formData) => {
    console.log('handleSubmit called with:', formData);
    setIsSubmitting(true);
    
    try {
      const result = await assessmentAPI.submitAssessment(formData);
      console.log('Assessment result:', result);
      
      if (result.error) {
        throw new Error(result.message);
      }
      
      // Redirect to results page
      navigate('/results');
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Assessment submission failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResult = (data) => {
    console.log('Assessment completed:', data);
    // Additional handling if needed
  };

  // Inline styles to match original
  const styles = {
    assessmentPage: {
      minHeight: '100vh',
      background: 'var(--background-light, #f8f9fa)'
    },
    assessmentHeader: {
      background: 'white',
      padding: '40px 0',
      borderBottom: '1px solid var(--border-color, #e0e0e0)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    headerContent: {
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    },
    pageTitle: {
      fontSize: '36px',
      fontWeight: '700',
      color: 'var(--text-primary, #333)',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, var(--primary-color, #4CAF50) 0%, var(--secondary-color, #45a049) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    pageDescription: {
      fontSize: '18px',
      color: 'var(--text-secondary, #666)',
      lineHeight: '1.6',
      marginBottom: '40px'
    },
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '20px'
    },
    benefitItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: 'var(--background-light, #f8f9fa)',
      borderRadius: '12px',
      border: '1px solid var(--border-color, #e0e0e0)'
    },
    benefitIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, var(--primary-color, #4CAF50) 0%, var(--secondary-color, #45a049) 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0
    },
    benefitText: {
      textAlign: 'left'
    },
    benefitTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-primary, #333)',
      marginBottom: '4px'
    },
    benefitDescription: {
      fontSize: '14px',
      color: 'var(--text-secondary, #666)',
      lineHeight: '1.4'
    },
    assessmentContent: {
      padding: '60px 0'
    },
    assessmentFooter: {
      background: 'white',
      padding: '30px 0',
      borderTop: '1px solid var(--border-color, #e0e0e0)'
    },
    footerNote: {
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    },
    footerNoteP: {
      fontSize: '14px',
      color: 'var(--text-muted, #999)',
      lineHeight: '1.5',
      fontStyle: 'italic',
      margin: 0
    }
  };

  // Responsive styles for mobile
  const mobileStyles = {
    '@media (max-width: 768px)': {
      pageTitle: {
        fontSize: '28px'
      },
      pageDescription: {
        fontSize: '16px'
      },
      benefitsGrid: {
        gridTemplateColumns: '1fr'
      },
      benefitItem: {
        flexDirection: 'column',
        textAlign: 'center'
      },
      benefitText: {
        textAlign: 'center'
      },
      assessmentContent: {
        padding: '40px 0'
      }
    }
  };

  return (
    <div style={styles.assessmentPage}>
      {/* Header Section */}
      <div style={styles.assessmentHeader}>
        <div style={styles.container}>
          <div style={styles.headerContent}>
            <h1 style={styles.pageTitle}>Asesmen Diet untuk Personalisasi Makanan</h1>
            <p style={styles.pageDescription}>
              Dapatkan rekomendasi makanan sehat yang disesuaikan dengan tujuan diet dan kondisi kesehatan Anda
            </p>

            <div style={styles.benefitsGrid}>
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} style={styles.benefitItem}>
                    <div style={styles.benefitIcon}>
                      <IconComponent size={24} />
                    </div>
                    <div style={styles.benefitText}>
                      <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                      <p style={styles.benefitDescription}>{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      <div style={styles.assessmentContent}>
        <div style={styles.container}>
          <AssessmentForm 
            onSubmit={handleSubmit}
            onResult={handleResult}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div style={styles.assessmentFooter}>
        <div style={styles.container}>
          <div style={styles.footerNote}>
            <p style={styles.footerNoteP}>
              * Hasil asesmen ini bersifat informatif dan tidak menggantikan konsultasi medis profesional.
              Untuk kondisi kesehatan khusus, disarankan untuk berkonsultasi dengan dokter atau ahli gizi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;