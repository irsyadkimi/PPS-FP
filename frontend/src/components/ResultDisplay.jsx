import React, { useState, useEffect } from 'react';
import { assessmentAPI } from '../services/api';
import RecommendationList from './RecommendationList';
import MealModal from './MealModal';

const goalLabelToEnum = {
  'Hidup Sehat': 'hidup_sehat',
  'Diet': 'diet',
  'Massa Otot': 'massa_otot'
};

const ResultDisplay = ({ result, onBackToAssessment, onGoToMenu }) => {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    if (result && result.name) {
      loadAssessmentHistory();
      fetchRecommendations();
    }
  }, [result]);

  const fetchRecommendations = async () => {
    try {
      const response = await assessmentAPI.getRecommendations();
      if (response.success) {
        const { meals, mealPlan } = response.data || {};
        const mealList = meals && meals.length > 0 ? meals : mealPlan?.meals || [];
        setRecommendedMeals(mealList);
      }
    } catch (error) {
      console.error('Failed to load meal recommendations:', error);
    }
  };

  const loadAssessmentHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await assessmentAPI.getAssessmentHistory();
      if (response.success) {
        setHistory(response.data.assessments || []);
      }
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getBMICategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'normal': return 'bmi-normal';
      case 'underweight': return 'bmi-underweight';
      case 'overweight': return 'bmi-overweight';
      case 'obese': return 'bmi-obese';
      default: return 'bmi-normal';
    }
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>Hasil Asesmen Diet Anda</h2>
        <p>Berikut adalah analisis dan rekomendasi berdasarkan data yang Anda berikan:</p>
      </div>

      <div className="result-content">
        {/* User Info Section */}
        <div className="user-info-card">
          <h3>Informasi Pribadi</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Nama:</span>
              <span className="value">{result.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Umur:</span>
              <span className="value">{result.personalData?.age} tahun</span>
            </div>
            <div className="info-item">
              <span className="label">Berat Badan:</span>
              <span className="value">{result.personalData?.weight} kg</span>
            </div>
            <div className="info-item">
              <span className="label">Tinggi Badan:</span>
              <span className="value">{result.personalData?.height} cm</span>
            </div>
            <div className="info-item">
              <span className="label">Tujuan:</span>
              <span className="value">{result.goal}</span>
            </div>
            {result.diseases && result.diseases.length > 0 && (
              <div className="info-item">
                <span className="label">Riwayat Penyakit:</span>
                <span className="value">{result.diseases.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* BMI Section */}
        <div className="bmi-card">
          <h3>Indeks Massa Tubuh (BMI)</h3>
          <div className="bmi-display">
            <div className="bmi-value">
              <span className="bmi-number">{result.results?.analysis?.bmi?.toFixed(1)}</span>
              <span className={`bmi-category ${getBMICategoryClass(result.results?.analysis?.bmiCategory)}`}>
                {result.results?.analysis?.bmiCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="recommendations-card">
          <h3>Rekomendasi Diet</h3>
          {result.results?.recommendations && (
            <div className="recommendations-content">
              {result.results.recommendations.primary && (
                <div className="rec-section">
                  <h4>Rekomendasi Utama:</h4>
                  <ul>
                    {result.results.recommendations.primary.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.results.recommendations.dietary && (
                <div className="rec-section">
                  <h4>Panduan Makanan:</h4>
                  <ul>
                    {result.results.recommendations.dietary.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.results.recommendations.lifestyle && (
                <div className="rec-section">
                  <h4>Gaya Hidup:</h4>
                  <ul>
                    {result.results.recommendations.lifestyle.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meal Recommendations */}
        <div className="meal-recommendations-card">
          <h3>Rekomendasi Makanan</h3>
          <RecommendationList
            meals={recommendedMeals}
            onSelect={setSelectedMeal}
            goal={goalLabelToEnum[result.goal] || result.goal}
          />
        </div>

        {/* Summary Section */}
        {result.results?.summary && (
          <div className="summary-card">
            <h3>Ringkasan</h3>
            <p>{result.results.summary}</p>
          </div>
        )}

        {/* Assessment History Toggle */}
        <div className="history-section">
          <button 
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
            disabled={loadingHistory}
          >
            {loadingHistory ? 'Memuat...' : showHistory ? 'Sembunyikan Riwayat' : 'Lihat Riwayat Asesmen'}
          </button>

          {showHistory && (
            <div className="history-content">
              <h4>Riwayat Asesmen</h4>
              {history.length === 0 ? (
                <p>Belum ada riwayat asesmen sebelumnya.</p>
              ) : (
                <div className="history-list">
                  {history.map((assessment, index) => (
                    <div key={assessment._id || index} className="history-item">
                      <div className="history-date">
                        {new Date(assessment.createdAt).toLocaleDateString('id-ID')}
                      </div>
                      <div className="history-details">
                        <span>BMI: {assessment.results?.analysis?.bmi?.toFixed(1)} ({assessment.results?.analysis?.bmiCategory})</span>
                        <span>Tujuan: {assessment.goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={onBackToAssessment}
          >
            Asesmen Ulang
          </button>
          <button 
            className="btn btn-primary"
            onClick={onGoToMenu}
          >
            Lihat Menu Makanan
          </button>
        </div>
      </div>

      {/* Meal Modal */}
      {selectedMeal && (
        <MealModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
      <style jsx>{`
        .result-display {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .result-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .result-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .user-info-card,
        .bmi-card,
        .recommendations-card,
        .meal-recommendations-card,
        .summary-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .info-item .label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .info-item .value {
          color: var(--text-primary);
        }

        .bmi-display {
          text-align: center;
          margin-top: 16px;
        }

        .bmi-number {
          font-size: 36px;
          font-weight: 700;
        }

        .bmi-category {
          display: block;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }

        .history-content {
          margin-top: 16px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          background: var(--background-light);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
        }

        .toggle-history-btn {
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .result-display {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultDisplay;