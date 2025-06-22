import React from 'react';

const MealModal = ({ meal, onClose }) => {
  if (!meal) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{meal.name}</h2>
        {meal.image && (
          <img
            src={meal.image}
            alt={meal.name}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }}
          />
        )}
        <p>{meal.description}</p>
        {meal.calories && (
          <p><strong>Kalori:</strong> {meal.calories} kkal</p>
        )}
        <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '12px' }}>
          Tutup
        </button>
      </div>
    </div>
  );
};

export default MealModal;
