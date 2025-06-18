import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity
} from 'lucide-react';
import { assessmentAPI, apiUtils } from '../services/api';
import LoadingSpinner, { PageLoader, CardLoader } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistoryData();
  }, [currentPage]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const userId = apiUtils.getUserId();
      const response = await assessmentAPI.getHistory(userId, currentPage, itemsPerPage);
      
      if (response.success) {
        setHistoryData(response.data);
      } else {
        throw new Error('Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Gagal memuat riwayat asesmen');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBMITrend = (current, previous) => {
    if (!previous) return { icon: Minus, color: 'gray', text: '-' };
    
    const diff = current - previous;
    if (diff > 0.1) return { icon: TrendingUp, color: 'red', text: `+${diff.toFixed(1)}` };
    if (diff < -0.1) return { icon: TrendingDown, color: 'green', text: diff.toFixed(1) };
    return { icon: Minus, color: 'gray', text: '0' };
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#f56565';
  };

  const filteredAndSortedAssessments = () => {
    if (!historyData?.assessments) return [];
    
    let filtered = historyData.assessments.filter(assessment => {
      const matchesSearch = !searchTerm || 
        assessment.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assessment.diseases || []).some(disease => 
          disease.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilter = filterGoal === 'all' || assessment.goal === filterGoal;
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'bmi':
          return (b.results?.analysis?.bmi || 0) - (a.results?.analysis?.bmi || 0);
        case 'score':
          return (b.results?.healthScore || 0) - (a.results?.healthScore || 0);
        default:
          return 0;
      }
    });
  };

  if (loading && !historyData) {
    return <PageLoader message="Memuat riwayat asesmen..." />;
  }

  if (!historyData?.assessments || historyData.assessments.length === 0) {
    return (
      <div className="empty-history">
        <div className="container">
          <div className="empty-content">
            <Activity size={64} className="empty-icon" />
            <h1>Belum Ada Riwayat Asesmen</h1>
            <p>Anda belum pernah melakukan asesmen diet. Mulai sekarang untuk mendapatkan rekomendasi makanan yang tepat!</p>
            <Link to="/assessment" className="btn btn-primary btn-large">
              Mulai Asesmen Pertama
            </Link>
          </div>
        </div>

        <style jsx>{`
          .empty-history {
            min-height: 100vh;
            background: var(--background-light);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .empty-content {
            text-align: center;
            max-width: 500px;
          }

          .empty-icon {
            color: var(--text-muted);
            margin-bottom: 24px;
          }

          .empty-content h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 16px;
          }

          .empty-content p {
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 32px;
          }
        `}</style>
      </div>
    );
  }

  const assessments = filteredAndSortedAssessments();
  const { statistics } = historyData;

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Riwayat Asesmen Diet</h1>
              <p className="page-description">
                Pantau perkembangan kesehatan dan diet Anda dari waktu ke waktu
              </p>
            </div>
            
            <div className="header-actions">
              <Link to="/assessment" className="btn btn-primary">
                Asesmen Baru
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="statistics-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{statistics.totalAssessments}</div>
                  <div className="stat-label">Total Asesmen</div>
                </div>
              </div>
              
              {statistics.progressSummary && (
                <>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">
                        {statistics.progressSummary.weightChange > 0 ? '+' : ''}
                        {statistics.progressSummary.weightChange.toFixed(1)} kg
                      </div>
                      <div className="stat-label">Perubahan Berat</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Activity size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">
                        {statistics.progressSummary.bmiChange > 0 ? '+' : ''}
                        {statistics.progressSummary.bmiChange.toFixed(1)}
                      </div>
                      <div className="stat-label">Perubahan BMI</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{statistics.progressSummary.timeSpan.days}</div>
                      <div className="stat-label">Hari Tracking</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-content">
            <div className="search-filter">
              <Search size={18} />
              <input
                type="text"
                placeholder="Cari berdasarkan tujuan atau kondisi kesehatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="filter-select"
              >
                <option value="all">Semua Tujuan</option>
                <option value="Hidup Sehat">Hidup Sehat</option>
                <option value="Diet">Diet</option>
                <option value="Massa Otot">Massa Otot</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">Urutkan: Tanggal</option>
                <option value="bmi">Urutkan: BMI</option>
                <option value="score">Urutkan: Skor Kesehatan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment List */}
      <div className="assessments-section">
        <div className="container">
          {loading ? (
            <CardLoader message="Memuat data..." />
          ) : assessments.length === 0 ? (
            <div className="no-results">
              <p>Tidak ada hasil yang sesuai dengan filter</p>
            </div>
          ) : (
            <div className="assessments-list">
              {assessments.map((assessment, index) => {
                const previousAssessment = assessments[index + 1];
                const bmiTrend = getBMITrend(
                  assessment.results?.analysis?.bmi || 0,
                  previousAssessment?.results?.analysis?.bmi
                );
                const TrendIcon = bmiTrend.icon;

                return (
                  <div key={assessment._id} className="assessment-card">
                    <div className="card-header">
                      <div className="assessment-date">
                        <Calendar size={16} />
                        <span>{formatDate(assessment.createdAt)}</span>
                      </div>
                      <div className="assessment-actions">
                        <Link 
                          to={`/results/${assessment._id}`}
                          className="btn btn-small btn-secondary"
                        >
                          <Eye size={14} />
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="assessment-info">
                        <div className="info-group">
                          <h3 className="assessment-goal">{assessment.goal}</h3>
                          <p className="assessment-conditions">
                            {assessment.diseases?.length > 0 
                              ? `Kondisi: ${assessment.diseases.join(', ')}`
                              : 'Tidak ada kondisi khusus'
                            }
                          </p>
                        </div>
                        
                        <div className="metrics-grid">
                          <div className="metric-item">
                            <div className="metric-label">BMI</div>
                            <div className="metric-value">
                              <span>{assessment.results?.analysis?.bmi?.toFixed(1) || '-'}</span>
                              <div className="trend-indicator" style={{ color: bmiTrend.color }}>
                                <TrendIcon size={14} />
                                <span>{bmiTrend.text}</span>
                              </div>
                            </div>
                            <div className="metric-category">
                              {assessment.results?.analysis?.bmiCategory || '-'}
                            </div>
                          </div>
                          
                          <div className="metric-item">
                            <div className="metric-label">Berat Badan</div>
                            <div className="metric-value">
                              {assessment.personalData?.weight || '-'} kg
                            </div>
                          </div>
                          
                          <div className="metric-item">
                            <div className="metric-label">Skor Kesehatan</div>
                            <div className="metric-value">
                              <div 
                                className="health-score-badge"
                                style={{ 
                                  background: getHealthScoreColor(assessment.results?.healthScore || 0)
                                }}
                              >
                                {assessment.results?.healthScore || 0}/100
                              </div>
                            </div>
                          </div>
                          
                          <div className="metric-item">
                            <div className="metric-label">Kalori Harian</div>
                            <div className="metric-value">
                              {assessment.results?.analysis?.dailyCalories || '-'} kkal
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {historyData?.pagination && historyData.pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!historyData.pagination.hasPrevPage}
                className="pagination-btn"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              <div className="pagination-info">
                Page {historyData.pagination.currentPage} of {historyData.pagination.totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!historyData.pagination.hasNextPage}
                className="pagination-btn"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .history-page {
          min-height: 100vh;
          background: var(--background-light);
        }

        .history-header {
          background: white;
          padding: 40px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .page-description {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .statistics-section {
          padding: 40px 0;
          background: white;
          border-bottom: 1px solid var(--border-color);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: var(--background-light);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .filters-section {
          background: white;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .filters-content {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .search-filter {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--background-light);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .search-filter svg {
          color: var(--text-muted);
        }

        .search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
          color: var(--text-primary);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .assessments-section {
          padding: 40px 0;
        }

        .assessments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .assessment-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
        }

        .assessment-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: var(--background-light);
          border-bottom: 1px solid var(--border-color);
        }

        .assessment-date {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .card-content {
          padding: 24px;
        }

        .assessment-goal {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .assessment-conditions {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .metric-item {
          text-align: center;
        }

        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .metric-category {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 500;
        }

        .health-score-badge {
          padding: 4px 8px;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          margin-top: 40px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .page-title {
            font-size: 24px;
          }

          .filters-content {
            flex-direction: column;
            gap: 16px;
          }

          .filter-controls {
            width: 100%;
            justify-content: center;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .pagination {
            flex-direction: column;
            gap: 16px;
          }

          .assessment-card {
            margin: 0 -8px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .assessment-actions {
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .card-content {
            padding: 16px;
          }

          .assessment-goal {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;