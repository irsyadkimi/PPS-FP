import React, { useState, useEffect } from 'react';
import { assessmentAPI } from '../services/api';
import { getMealsForUser } from '../mealRecommendations';
import RecommendationList from './RecommendationList';
import MealModal from './MealModal';

const ResultDisplay = ({ result, onBackToAssessment, onGoToMenu }) => {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    if (result && result.name) {
      loadAssessmentHistory();
      const meals = getMealsForUser(result.goal, result.diseases || []);
      setRecommendedMeals(meals);
    }
  }, [result]);

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

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#f44336';
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!result) {
    return (
      <div className="result-display">
        <div className="result-error">
          <h2>❌ Tidak ada hasil untuk ditampilkan</h2>
          <button className="btn btn-primary" onClick={onBackToAssessment}>
            Kembali ke Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-display">
      <div className="result-header">
        <h1>📊 Hasil Assessment Anda</h1>
        <p>Halo <strong>{result.name}</strong>, berikut analisis kesehatan Anda</p>
      </div>

      {recommendedMeals.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Rekomendasi Makanan</h3>
          <RecommendationList meals={recommendedMeals} onSelect={setSelectedMeal} />
        </div>
      )}

      {/* BMI Card */}
      <div className="result-card bmi-card">
        <div className="card-header">
          <h2>📏 Indeks Massa Tubuh (BMI)</h2>
        </div>
        <div className="bmi-display">
          <div className="bmi-value">{result.bmi}</div>
          <div className={`bmi-category ${getBMICategoryClass(result.bmiCategory)}`}>
            {result.bmiCategory}
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      {result.healthScore && (
        <div className="result-card health-score-card">
          <div className="card-header">
            <h2>💚 Skor Kesehatan</h2>
          </div>
          <div className="health-score">
            <div 
              className="score-circle"
              style={{ '--score-color': getHealthScoreColor(result.healthScore) }}
            >
              <div className="score-value">{result.healthScore}</div>
              <div className="score-label">dari 100</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Card */}
      {result.recommendations && (
        <div className="result-card recommendations-card">
          <div className="card-header">
            <h2>🎯 Rekomendasi Personal</h2>
          </div>
          <div className="recommendations">
            {result.recommendations.primary && result.recommendations.primary.length > 0 && (
              <div className="recommendation-section">
                <h3>🌟 Rekomendasi Utama</h3>
                <ul className="recommendation-list">
                  {result.recommendations.primary.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations.dietary && result.recommendations.dietary.length > 0 && (
              <div className="recommendation-section">
                <h3>🍽️ Rekomendasi Diet</h3>
                <ul className="recommendation-list">
                  {result.recommendations.dietary.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations.lifestyle && result.recommendations.lifestyle.length > 0 && (
              <div className="recommendation-section">
                <h3>🏃‍♂️ Rekomendasi Gaya Hidup</h3>
                <ul className="recommendation-list">
                  {result.recommendations.lifestyle.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meal Plan Card */}
      {result.mealPlan && (
        <div className="result-card meal-plan-card">
          <div className="card-header">
            <h2>📅 Rencana Makan Harian</h2>
            <p>Target Kalori: <strong>{result.mealPlan.totalCalories} kkal/hari</strong></p>
          </div>
          <div className="meal-plan">
            {result.mealPlan.meals?.map((meal, index) => (
              <div key={index} className="meal-item">
                <h4>{meal.time}</h4>
                <p><strong>{meal.targetCalories} kkal</strong></p>
                {meal.suggestions && meal.suggestions.length > 0 && (
                  <ul className="meal-suggestions">
                    {meal.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Card */}
      {result.summary && (
        <div className="result-card summary-card">
          <div className="card-header">
            <h2>📝 Ringkasan</h2>
          </div>
          <div className="summary">
            <p>{result.summary}</p>
          </div>
        </div>
      )}

      {/* Assessment History */}
      <div className="result-card history-card">
        <div className="card-header">
          <h2>📈 Riwayat Assessment</h2>
          <button 
            className="btn btn-outline"
            onClick={() => setShowHistory(!showHistory)}
            disabled={loadingHistory}
          >
            {loadingHistory ? '⏳ Loading...' : showHistory ? 'Sembunyikan' : 'Lihat Riwayat'}
          </button>
        </div>
        
        {showHistory && (
          <div className="history-content">
            {history.length === 0 ? (
              <p className="no-history">Ini adalah assessment pertama Anda! 🎉</p>
            ) : (
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={item.id} className="history-item">
                    <div className="history-date">
                      <strong>{item.date}</strong>
                      <span>{item.time}</span>
                    </div>
                    <div className="history-data">
                      <span className={`history-bmi ${getBMICategoryClass(item.category)}`}>
                        BMI: {item.bmi}
                      </span>
                      <span className="history-goal">{item.goal}</span>
                      {item.healthScore && (
                        <span className="history-score">
                          Skor: {item.healthScore}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="result-actions">
        <button 
          className="btn btn-primary btn-large"
          onClick={onGoToMenu}
        >
          🍽️ Lihat Menu Makanan Sehat & Order
        </button>
        
        <div className="secondary-actions">
          <button 
            className="btn btn-outline"
            onClick={onBackToAssessment}
          >
            🔄 Assessment Ulang
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            🖨️ Cetak Hasil
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>⚠️ <strong>Penting:</strong> Hasil assessment ini bersifat informatif dan tidak menggantikan konsultasi medis profesional. Untuk kondisi kesehatan khusus, disarankan berkonsultasi dengan dokter atau ahli gizi.</p>
      </div>

      <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </div>
  );
};

export default ResultDisplay;