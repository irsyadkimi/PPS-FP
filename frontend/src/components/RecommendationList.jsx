import React from 'react';
import './RecommendationList.css';

const goalToPackageMap = {
  hidup_sehat: 'Paket Sehat Harian',
  diet: 'Paket Diet Rendah Kalori',
  massa_otot: 'Paket Protein Tinggi',
  'menambah massa otot': 'Paket Protein Tinggi'
};

const goalLabelToEnum = {
  'Hidup Sehat': 'hidup_sehat',
  'Diet': 'diet',
  'Massa Otot': 'massa_otot'
};

const staticMeals = {
  diet: {
    diabetes: [
      'Salad ayam rendah gula',
      'Sup brokoli tanpa garam',
      'Ikan kukus + sayur kukus'
    ],
    hipertensi: [
      'Sup sayur tanpa garam',
      'Tumis buncis rendah sodium',
      'Tahu rebus + nasi merah'
    ],
    kolesterol: [
      'Sayur bening bayam',
      'Nasi merah + tempe kukus',
      'Sup jagung tanpa minyak'
    ],
    asam_urat: [
      'Nasi merah + sup labu',
      'Telur rebus + bayam',
      'Smoothie buah rendah gula'
    ],
    none: [
      'Oatmeal buah',
      'Nasi merah + sayur tumis',
      'Ayam rebus + brokoli'
    ]
  },
  hidup_sehat: {
    none: [
      'Nasi merah + tempe goreng kering',
      'Omelet sayur',
      'Smoothie pisang & susu'
    ]
  },
  massa_otot: {
    diabetes: [
      'Dada ayam panggang',
      'Telur rebus 3 butir',
      'Protein shake tanpa gula'
    ],
    hipertensi: [
      'Ikan panggang tanpa garam',
      'Tahu kukus + bayam',
      'Telur rebus + nasi merah'
    ],
    kolesterol: [
      'Tumis dada ayam + sayur',
      'Putih telur rebus',
      'Nasi merah + tahu kukus'
    ],
    asam_urat: [
      'Protein shake rendah purin',
      'Sayur rebus + telur',
      'Ayam kukus + labu siam'
    ],
    none: [
      'Steak ayam + nasi merah',
      'Telur orak-arik + roti gandum',
      'Susu protein tinggi'
    ]
  }
};

const RecommendationList = ({ goal, diseases = [], onSelect }) => {
  if (!goal) return null;

  const goalKey = goalLabelToEnum[goal] || goal.toLowerCase();
  const disease = diseases && diseases.length > 0 ? diseases[0].toLowerCase() : 'none';
  const mealList = staticMeals[goalKey]?.[disease] || [];
  const packageName = goalToPackageMap[goalKey] || 'Paket Makanan Sehat';

  const mealsToRender = mealList.slice(0, 3);

  return (
    <div className="recommendation-wrapper">
      <h4 style={{ fontSize: '20px', marginBottom: '16px' }}>{packageName}</h4>
      <div className="recommendation-list">
        {mealsToRender.map((meal, index) => (
          <div
            key={index}
            className="meal-card"
            onClick={() => onSelect && onSelect({ name: meal })}
            role="button"
            tabIndex={0}
          >
            <div className="meal-image">
              <span className="image-fallback" role="img" aria-label="Food">
                🍽️
              </span>
            </div>
            <h3 className="meal-title">{meal}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
