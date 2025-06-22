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
        // Expecting meals array under data.meals or similar structure
        const meals = response.data?.meals || [];
        setRecommendedMeals(meals);
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
              <span className="bmi-number">{result.results?.bmi?.toFixed(1)}</span>
              <span className={`bmi-category ${getBMICategoryClass(result.results?.bmiCategory)}`}>
                {result.results?.bmiCategory}
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
            onSelectMeal={setSelectedMeal}
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
                        <span>BMI: {assessment.results?.bmi?.toFixed(1)} ({assessment.results?.bmiCategory})</span>
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
    </div>
  );
};

export default ResultDisplay;