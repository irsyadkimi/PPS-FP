import React from 'react';

const RecommendationList = ({ meals, onSelect }) => (
  <div className="meal-grid">
    {meals.map((meal) => (
      <div
        key={meal.id}
        className="meal-card"
        onClick={() => onSelect && onSelect(meal)}
        style={{ cursor: 'pointer' }}
      >
        {meal.image && (
          <img
            src={meal.image}
            alt={meal.name}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }}
          />
        )}
        <h3 style={{ marginTop: 0 }}>{meal.name}</h3>
        <p>{meal.description}</p>
        {meal.calories && (
          <p style={{ fontWeight: 'bold' }}>{meal.calories} kkal</p>
        )}
      </div>
    ))}
  </div>
);

export default RecommendationList;
