import React from 'react';
import './RecommendationList.css';

const RecommendationList = ({ meals = [], onSelect }) => {
  const formatPrice = (value) => {
    if (value === undefined || value === null) return null;
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    } catch {
      return `Rp${value}`;
    }
  };

  return (
    <div className="recommendation-list">
      {meals.map((meal) => (
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
          {meal.description && (
            <p className="meal-description">{meal.description}</p>
          )}
          <div className="meal-stats">
            {meal.calories !== undefined && (
              <span className="meal-calories">{meal.calories} kkal</span>
            )}
            {meal.price !== undefined && (
              <span className="meal-price">{formatPrice(meal.price)}</span>
            )}
          </div>
          {(meal.protein !== undefined ||
            meal.carbs !== undefined ||
            meal.fat !== undefined) && (
            <div className="nutrition-info">
              {meal.protein !== undefined && (
                <span>Protein: {meal.protein}g</span>
              )}
              {meal.carbs !== undefined && <span>Karbo: {meal.carbs}g</span>}
              {meal.fat !== undefined && <span>Lemak: {meal.fat}g</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;
