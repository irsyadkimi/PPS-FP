import React, { useState } from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result, onStartOver }) => {
  const [showFoodRecommendation, setShowFoodRecommendation] = useState(false);

  if (!result || !result.data) {
    return (
      <div className="result-error">
        <h3>Terjadi kesalahan</h3>
        <p>Data hasil asesmen tidak ditemukan.</p>
        <button onClick={onStartOver} className="btn-retry">
          Coba Lagi
        </button>
      </div>
    );
  }

  const { dietType, analysis, foods } = result.data;

  const handleOrderFood = () => {
    setShowFoodRecommendation(true);
  };

  if (showFoodRecommendation) {
    return (
      <div className="food-recommendation">
        <h2>Berikut makanan berdasarkan Hasil Assesmen anda</h2>
        <p>pilih salah satu paket pakanan dibawah ini</p>
        
        <div className="food-grid">
          {foods && foods.map((food, index) => (
            <div key={index} className="food-card">
              <div className="food-image">
                <img 
                  src={food.image || '/images/default-food.jpg'} 
                  alt={food.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x150?text=Makanan+Sehat';
                  }}
                />
              </div>
              <div className="food-info">
                <h4>{food.name}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button onClick={() => setShowFoodRecommendation(false)} className="btn-back">
            Kembali ke Hasil
          </button>
          <button className="btn-order">
            Pesan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-display">
      <div className="result-container">
        <h2>Berikut Hasil Assesmen anda</h2>
        
        <div className="result-content">
          <h3>Hasil Asesmen Anda – {dietType}</h3>
          
          {analysis && (
            <div className="analysis-section">
              <p className="kondisi">{analysis.kondisi}</p>
              
              {analysis.masalahUtama && (
                <div className="masalah-utama">
                  <h4>⚠️ Catatan Utama:</h4>
                  <ul>
                    {analysis.masalahUtama.map((masalah, index) => (
                      <li key={index}>{masalah}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.kebutuhanUtama && (
                <div className="kebutuhan-utama">
                  <h4>✅ Kebutuhan Utama:</h4>
                  <ul>
                    {analysis.kebutuhanUtama.map((kebutuhan, index) => (
                      <li key={index}>{kebutuhan}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.bmi && (
                <div className="bmi-info">
                  <p><strong>BMI Anda:</strong> {analysis.bmi}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="question-section">
            <p>ingin segeran melakukan pemesanan??</p>
            
            <div className="action-buttons">
              <button onClick={onStartOver} className="btn-no">
                TIDAK
              </button>
              <button onClick={handleOrderFood} className="btn-yes">
                YA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
