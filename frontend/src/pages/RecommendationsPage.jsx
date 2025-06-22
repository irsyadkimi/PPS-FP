import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import LoadingSpinner, { PageLoader } from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await assessmentAPI.getRecommendations();
        if (response.success) {
          setData(response.data);
        } else {
          console.error('Failed to load recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader message="Memuat menu makanan..." />;
  }

  if (!data?.meals?.length) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Tidak ada rekomendasi tersedia</h1>
        <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="recommendations-page" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-small">
            <ArrowLeft size={18} />
            Kembali
          </button>
          <h1 style={{ margin: 0 }}>Menu Makanan Sehat</h1>
        </div>
        <div className="meal-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {data.meals.map((meal) => (
            <div key={meal.id} className="meal-card" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', background: 'white' }}>
              {meal.image && (
                <img src={meal.image} alt={meal.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }} />
              )}
              <h3 style={{ marginTop: 0 }}>{meal.name}</h3>
              <p>{meal.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: 'bold' }}>
                <span>{meal.calories} kkal</span>
                <span>Rp{meal.price}</span>
              </div>
              <button className="btn btn-primary btn-small" style={{ marginTop: '16px', width: '100%' }}>
                Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
