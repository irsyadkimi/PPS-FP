import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import ResultDisplay from '../components/ResultDisplay';
import LoadingSpinner, { PageLoader } from '../components/LoadingSpinner';
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultsPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchAssessmentData();
  }, [assessmentId, retryCount]);

  const fetchAssessmentData = async () => {
    if (!assessmentId) {
      setError('Assessment ID tidak ditemukan');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await assessmentAPI.getAssessmentById(assessmentId);
      
      if (response.success) {
        setAssessmentData(response.data);
        
        // Save latest assessment for future reference
        localStorage.setItem('dietapp_latest_assessment', assessmentId);
        localStorage.setItem('dietapp_latest_results', JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Failed to fetch assessment data');
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      setError(error.message || 'Failed to load assessment results');
      
      if (error.response?.status === 404) {
        toast.error('Assessment tidak ditemukan');
      } else {
        toast.error('Gagal memuat hasil asesmen');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleBackToAssessment = () => {
    navigate('/assessment');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleNewAssessment = () => {
    // Clear current assessment data
    localStorage.removeItem('dietapp_latest_assessment');
    localStorage.removeItem('dietapp_latest_results');
    navigate('/assessment');
  };

  const handleGoToMenu = () => {
    navigate('/recommendations');
  };

  // Loading state
  if (loading) {
    return (
      <PageLoader message="Memuat hasil asesmen..." />
    );
  }

  // Error state
  if (error && !assessmentData) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <div className="error-icon">
              <AlertTriangle size={64} />
            </div>
            
            <h1 className="error-title">Gagal Memuat Hasil</h1>
            <p className="error-message">{error}</p>
            
            <div className="error-actions">
              <button 
                onClick={handleRetry}
                className="btn btn-primary"
              >
                <RotateCcw size={18} />
                Coba Lagi
              </button>
              
              <button 
                onClick={handleBackToAssessment}
                className="btn btn-secondary"
              >
                <ArrowLeft size={18} />
                Kembali ke Asesmen
              </button>
              
              <button 
                onClick={handleGoHome}
                className="btn btn-secondary"
              >
                Ke Beranda
              </button>
            </div>
            
            <div className="error-help">
              <p>
                Jika masalah berlanjut, silakan{' '}
                <button 
                  onClick={handleNewAssessment}
                  className="link-button"
                >
                  mulai asesmen baru
                </button>
                {' '}atau hubungi support kami.
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .error-page {
            min-height: 100vh;
            background: var(--background-light);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .error-content {
            text-align: center;
            max-width: 500px;
          }

          .error-icon {
            color: var(--error-color);
            margin-bottom: 24px;
          }

          .error-title {
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 16px;
          }

          .error-message {
            font-size: 16px;
            color: var(--text-secondary);
            margin-bottom: 32px;
            line-height: 1.6;
          }

          .error-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }

          .error-help {
            font-size: 14px;
            color: var(--text-muted);
          }

          .link-button {
            background: none;
            border: none;
            color: var(--primary-color);
            text-decoration: underline;
            cursor: pointer;
            font-size: inherit;
          }

          .link-button:hover {
            color: var(--primary-dark);
          }

          @media (max-width: 768px) {
            .error-title {
              font-size: 24px;
            }

            .error-actions {
              flex-direction: column;
              align-items: center;
            }

            .btn {
              width: 100%;
              max-width: 200px;
            }
          }
        `}</style>
      </div>
    );
  }

  const result = assessmentData ? {
    name: assessmentData.name,
    personalData: assessmentData.personalData,
    goal: assessmentData.goal,
    diseases: assessmentData.diseases,
    results: assessmentData.results,
  } : null;

  // Success state
  return (
    <div className="results-page">
      {/* Back Navigation */}
      <div className="results-nav">
        <div className="container">
          <div className="nav-content">
            <button 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <ArrowLeft size={18} />
              <span>Kembali</span>
            </button>
            
            <div className="nav-actions">
              <button 
                onClick={handleNewAssessment}
                className="btn btn-secondary btn-small"
              >
                <RotateCcw size={16} />
                Asesmen Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="results-content">
        {assessmentData ? (
          <ResultDisplay
            result={result}
            onBackToAssessment={handleNewAssessment}
            onGoToMenu={handleGoToMenu}
          />
        ) : (
          <div className="no-data">
            <p>Data asesmen tidak tersedia</p>
            <button onClick={handleNewAssessment} className="btn btn-primary">
              Mulai Asesmen Baru
            </button>
          </div>
        )}
      </div>

      {/* Thank You Message */}
      <div className="thank-you-section">
        <div className="container">
          <div className="thank-you-content">
            <h2>Terima Kasih!</h2>
            <p>
              Anda telah menyelesaikan asesmen diet. Gunakan rekomendasi ini sebagai 
              panduan untuk mencapai tujuan kesehatan Anda.
            </p>
            <div className="next-steps">
              <h3>Langkah Selanjutnya:</h3>
              <ul>
                <li>Ikuti rekomendasi makanan yang diberikan</li>
                <li>Pantau progress Anda secara berkala</li>
                <li>Konsultasi dengan ahli gizi jika diperlukan</li>
                <li>Lakukan asesmen ulang setelah 4-6 minggu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .results-page {
          min-height: 100vh;
          background: var(--background-light);
        }

        .results-nav {
          background: white;
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
          position: sticky;
          top: 80px;
          z-index: 100;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 16px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: var(--background-light);
          color: var(--text-primary);
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .results-content {
          padding: 40px 0;
        }

        .no-data {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .thank-you-section {
          background: white;
          border-top: 1px solid var(--border-color);
          padding: 60px 0;
        }

        .thank-you-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .thank-you-content h2 {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .thank-you-content > p {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .next-steps {
          background: var(--background-light);
          border-radius: 12px;
          padding: 24px;
          text-align: left;
        }

        .next-steps h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          text-align: center;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
        }

        .next-steps li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .next-steps li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--success-color);
          font-weight: bold;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-content {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .nav-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .results-content {
            padding: 20px 0;
          }

          .thank-you-content h2 {
            font-size: 24px;
          }

          .thank-you-content > p {
            font-size: 16px;
          }

          .thank-you-section {
            padding: 40px 0;
          }
        }

        @media (max-width: 480px) {
          .results-nav {
            position: static;
          }

          .nav-content {
            align-items: center;
          }

          .nav-actions .btn {
            padding: 8px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;