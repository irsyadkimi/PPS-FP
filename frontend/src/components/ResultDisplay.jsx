import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Utensils,
  ShoppingCart,
  Download,
  Share2
} from 'lucide-react';

const ResultDisplay = ({ assessmentData }) => {
  if (!assessmentData || !assessmentData.results) {
    return <div className="loading-container">Loading results...</div>;
  }

  const { results, personalData, goal, diseases } = assessmentData;
  const { analysis, recommendations, mealPlan, restrictions, summary, healthScore } = results;

  const getBMIColor = (category) => {
    switch (category) {
      case 'Underweight': return '#ed8936';
      case 'Normal': return '#48bb78';
      case 'Overweight': return '#ed8936';
      case 'Obese': return '#f56565';
      default: return '#718096';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#f56565';
  };

  const formatDiseases = (diseases) => {
    if (!diseases || diseases.length === 0) return 'Tidak ada';
    return diseases.join(', ');
  };

  return (
    <div className="result-display">
      {/* Header */}
      <div className="result-header">
        <h1 className="result-title">Berikut Hasil Asesmen Anda</h1>
        <p className="result-subtitle">
          Berdasarkan data yang Anda berikan, berikut adalah analisis dan rekomendasi untuk Anda
        </p>
      </div>

      {/* BMI Display */}
      <div className="bmi-section">
        <div className="bmi-card">
          <div className="bmi-header">
            <Heart size={32} className="bmi-icon" />
            <h2>Analisis BMI Anda</h2>
          </div>
          <div className="bmi-display">
            <div className="bmi-value" style={{ color: getBMIColor(analysis.bmiCategory) }}>
              {analysis.bmi}
            </div>
            <div className="bmi-category" style={{ color: getBMIColor(analysis.bmiCategory) }}>
              {analysis.bmiCategory}
            </div>
            <div className="bmi-details">
              <p>Berat Ideal: <strong>{analysis.idealWeight} kg</strong></p>
              <p>Selisih: <strong>{analysis.weightDifference > 0 ? '+' : ''}{analysis.weightDifference} kg</strong></p>
            </div>
          </div>
        </div>

        {/* Health Score */}
        <div className="health-score-card">
          <h3>Skor Kesehatan</h3>
          <div className="score-circle" style={{ background: getHealthScoreColor(healthScore) }}>
            {healthScore}/100
          </div>
          <p className="score-description">
            {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h2>Ringkasan Kondisi</h2>
          <p className="summary-text">{summary}</p>
          
          <div className="condition-grid">
            <div className="condition-item">
              <span className="condition-label">Tujuan:</span>
              <span className="condition-value">{goal}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Kebutuhan Kalori:</span>
              <span className="condition-value">{analysis.dailyCalories} kkal/hari</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Kondisi Kesehatan:</span>
              <span className="condition-value">{formatDiseases(diseases)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h2 className="section-title">Rekomendasi untuk Anda</h2>
        
        <div className="recommendations-grid">
          {/* Primary Recommendations */}
          <div className="recommendation-card primary">
            <div className="card-header">
              <CheckCircle size={24} />
              <h3>Catatan Utama</h3>
            </div>
            <ul className="recommendation-list">
              {recommendations.primary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Dietary Recommendations */}
          <div className="recommendation-card dietary">
            <div className="card-header">
              <Utensils size={24} />
              <h3>Kebutuhan Utama</h3>
            </div>
            <ul className="recommendation-list">
              {recommendations.dietary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Lifestyle Recommendations */}
          <div className="recommendation-card lifestyle">
            <div className="card-header">
              <TrendingUp size={24} />
              <h3>Gaya Hidup</h3>
            </div>
            <ul className="recommendation-list">
              {recommendations.lifestyle.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="meal-plan-section">
        <h2 className="section-title">Rencana Makan Harian</h2>
        <div className="daily-calories">
          <Clock size={20} />
          <span>Target Harian: <strong>{mealPlan.totalCalories} kalori</strong></span>
        </div>
        
        <div className="meal-grid">
          {mealPlan.meals.map((meal, index) => (
            <div key={index} className="meal-card">
              <div className="meal-header">
                <h3 className="meal-time">{meal.time}</h3>
                <div className="meal-calories">{meal.targetCalories} kkal</div>
              </div>
              <div className="meal-content">
                <h4>Saran Makanan:</h4>
                <ul className="meal-suggestions">
                  {meal.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
                {meal.guidelines && meal.guidelines.length > 0 && (
                  <div className="meal-guidelines">
                    <h4>Panduan:</h4>
                    <ul>
                      {meal.guidelines.map((guideline, idx) => (
                        <li key={idx}>{guideline}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Restrictions */}
      {restrictions && restrictions.length > 0 && (
        <div className="restrictions-section">
          <h2 className="section-title">Pantangan Makanan</h2>
          <div className="restrictions-grid">
            {restrictions.map((restriction, index) => (
              <div key={index} className="restriction-card">
                <div className="restriction-header">
                  <AlertTriangle size={20} />
                  <h3>{restriction.type}</h3>
                </div>
                <ul className="restriction-items">
                  {restriction.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="restriction-reason">{restriction.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-section">
        <h2 className="section-title">Ingin Segera Melakukan Pemesanan?</h2>
        <div className="action-buttons">
          <Link to="/order" className="btn btn-primary btn-large">
            <ShoppingCart size={20} />
            Pesan Makanan Sehat
          </Link>
          <button className="btn btn-secondary">
            <Download size={20} />
            Download Hasil
          </button>
          <button className="btn btn-secondary">
            <Share2 size={20} />
            Bagikan Hasil
          </button>
        </div>
      </div>

      <style jsx>{`
        .result-display {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .result-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .result-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .result-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .bmi-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        .bmi-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: var(--shadow-lg);
        }

        .bmi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .bmi-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .bmi-icon {
          color: var(--primary-color);
        }

        .bmi-display {
          text-align: center;
        }

        .bmi-value {
          font-size: 64px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .bmi-category {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .bmi-details {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .bmi-details p {
          margin: 4px 0;
        }

        .health-score-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow-lg);
          text-align: center;
        }

        .health-score-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .score-description {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .summary-section {
          margin-bottom: 40px;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: var(--shadow-lg);
        }

        .summary-card h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .summary-text {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .condition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .condition-item {
          display: flex;
          flex-direction: column;
          padding: 16px;
          background: var(--background-light);
          border-radius: 8px;
        }

        .condition-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .condition-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
          text-align: center;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .recommendation-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow-lg);
          border-left: 4px solid;
        }

        .recommendation-card.primary {
          border-left-color: var(--primary-color);
        }

        .recommendation-card.dietary {
          border-left-color: var(--success-color);
        }

        .recommendation-card.lifestyle {
          border-left-color: var(--warning-color);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .recommendation-list {
          list-style: none;
          padding: 0;
        }

        .recommendation-list li {
          padding: 8px 0;
          padding-left: 20px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .recommendation-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--primary-color);
          font-weight: bold;
          font-size: 18px;
        }

        .meal-plan-section {
          margin-bottom: 40px;
        }

        .daily-calories {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--background-light);
          border-radius: 12px;
          font-size: 16px;
          color: var(--text-secondary);
        }

        .meal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .meal-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .meal-header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .meal-time {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .meal-calories {
          font-size: 24px;
          font-weight: 700;
        }

        .meal-content {
          padding: 20px;
        }

        .meal-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .meal-suggestions {
          list-style: none;
          padding: 0;
          margin-bottom: 16px;
        }

        .meal-suggestions li {
          padding: 4px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .meal-guidelines {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        .meal-guidelines ul {
          list-style: none;
          padding: 0;
        }

        .meal-guidelines li {
          padding: 2px 0;
          color: var(--text-muted);
          font-size: 12px;
        }

        .restrictions-section {
          margin-bottom: 40px;
        }

        .restrictions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .restriction-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--shadow-lg);
          border-left: 4px solid var(--error-color);
        }

        .restriction-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--error-color);
        }

        .restriction-header h3 {
          font-size: 16px;
          font-weight: 600;
        }

        .restriction-items {
          list-style: none;
          padding: 0;
          margin-bottom: 12px;
        }

        .restriction-items li {
          padding: 4px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .restriction-reason {
          font-size: 12px;
          color: var(--text-muted);
          font-style: italic;
        }

        .action-section {
          text-align: center;
          padding: 40px 0;
          background: var(--background-light);
          border-radius: 16px;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .bmi-section {
            grid-template-columns: 1fr;
          }

          .recommendations-grid {
            grid-template-columns: 1fr;
          }

          .meal-grid {
            grid-template-columns: 1fr;
          }

          .restrictions-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .result-title {
            font-size: 24px;
          }

          .section-title {
            font-size: 22px;
          }

          .bmi-value {
            font-size: 48px;
          }

          .condition-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultDisplay;