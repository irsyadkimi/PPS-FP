import React from 'react';
import './RecommendationList.css';

const goalToPackageMap = {
  hidup_sehat: 'Paket Sehat Harian',
  diet: 'Paket Diet Rendah Kalori',
  massa_otot: 'Paket Protein Tinggi',
  'menambah massa otot': 'Paket Protein Tinggi'
};

const RecommendationList = ({ meals = [], onSelect, goal }) => {
  if (!goal || !meals.length) return null;

  const filteredMeals = meals.slice(0, 3); // limit to 3 meals only
  const packageName = goalToPackageMap[goal.toLowerCase()] || 'Paket Makanan Sehat';

  return (
    <div className="recommendation-wrapper">
      <h4 style={{ fontSize: '20px', marginBottom: '16px' }}>{packageName}</h4>
      <div className="recommendation-list">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id || meal._id}
            className="meal-card"
            onClick={() => onSelect && onSelect(meal)}
            role="button"
            tabIndex={0}
          >
            <div className="meal-image">
              {meal.image ? (
                <img src={meal.image} alt={meal.name} />
              ) : (
                <span className="image-fallback" role="img" aria-label="Food">
                  🍽️
                </span>
              )}
            </div>
            <h3 className="meal-title">{meal.name}</h3>
            {meal.description && <p className="meal-description">{meal.description}</p>}
            <div className="meal-stats">
              {meal.calories !== undefined && <span>{meal.calories} kkal</span>}
              {meal.price !== undefined && (
                <span>{
                  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(meal.price)
                }</span>
              )}
            </div>
            {(meal.protein || meal.carbs || meal.fat) && (
              <div className="nutrition-info">
                {meal.protein && <span>Protein: {meal.protein}g</span>}
                {meal.carbs && <span>Karbo: {meal.carbs}g</span>}
                {meal.fat && <span>Lemak: {meal.fat}g</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
