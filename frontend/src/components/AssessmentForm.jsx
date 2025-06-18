import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, User, Target, Heart, Send } from 'lucide-react';
import { assessmentAPI, apiUtils } from '../services/api';
import toast from 'react-hot-toast';

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });

  const steps = [
    { number: 1, title: 'Data Pribadi', icon: User },
    { number: 2, title: 'Tujuan Diet', icon: Target },
    { number: 3, title: 'Riwayat Kesehatan', icon: Heart },
    { number: 4, title: 'Konfirmasi', icon: Check }
  ];

  const goalOptions = [
    { value: 'Hidup Sehat', label: 'Hidup Sehat', description: 'Menjaga pola makan seimbang dan gaya hidup sehat' },
    { value: 'Diet', label: 'Diet', description: 'Menurunkan berat badan dengan cara yang sehat' },
    { value: 'Massa Otot', label: 'Massa Otot', description: 'Menambah massa otot dan meningkatkan performa fisik' }
  ];

  const diseaseOptions = [
    { value: 'Diabetes', label: 'Diabetes', description: 'Penyakit gula darah tinggi' },
    { value: 'Hipertensi', label: 'Darah Tinggi', description: 'Tekanan darah tinggi' },
    { value: 'Kolesterol', label: 'Kolesterol', description: 'Kolesterol tinggi dalam darah' },
    { value: 'Asam Urat', label: 'Asam Urat', description: 'Kadar asam urat tinggi' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiseaseChange = (disease) => {
    setFormData(prev => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter(d => d !== disease)
        : [...prev.diseases, disease]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.age && formData.weight && formData.height;
      case 2:
        return formData.goal;
      case 3:
        return true; // Diseases are optional
      case 4:
        return true; // Confirmation step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Mohon lengkapi semua field yang diperlukan');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = apiUtils.getUserId();
      const submissionData = {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseInt(formData.height),
        userId
      };

      const response = await assessmentAPI.submitAssessment(submissionData);
      
      if (response.success) {
        apiUtils.saveLatestAssessment(response.data.assessmentId);
        toast.success('Asesmen berhasil diselesaikan!');
        navigate(`/results/${response.data.assessmentId}`);
      }
    } catch (error) {
      toast.error('Gagal mengirim asesmen. Silakan coba lagi.');
      console.error('Assessment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content fade-in">
            <h2 className="step-title">Isi Data Berikut</h2>
            <p className="step-description">Masukkan data pribadi Anda untuk perhitungan yang akurat</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Umur (tahun)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Masukkan umur Anda"
                  min="10"
                  max="100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Berat Badan (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Masukkan berat badan"
                  min="30"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Masukkan tinggi badan"
                  min="100"
                  max="250"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content fade-in">
            <h2 className="step-title">Pilih Salah Satu dari Opsion Berikut</h2>
            <p className="step-description">Apa goals Anda?</p>
            
            <div className="options-grid">
              {goalOptions.map((option) => (
                <div
                  key={option.value}
                  className={`option-card ${formData.goal === option.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('goal', option.value)}
                >
                  <div className="option-header">
                    <h3 className="option-title">{option.label}</h3>
                    <div className="option-radio">
                      <input
                        type="radio"
                        name="goal"
                        value={option.value}
                        checked={formData.goal === option.value}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="option-description">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content fade-in">
            <h2 className="step-title">Pilih Satu atau Lebih dari Option Berikut</h2>
            <p className="step-description">Apakah Anda mengidap salah satu masalah kesehatan berikut?</p>
            
            <div className="checkbox-grid">
              {diseaseOptions.map((option) => (
                <div
                  key={option.value}
                  className={`checkbox-card ${formData.diseases.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => handleDiseaseChange(option.value)}
                >
                  <div className="checkbox-header">
                    <h3 className="checkbox-title">{option.label}</h3>
                    <input
                      type="checkbox"
                      checked={formData.diseases.includes(option.value)}
                      onChange={() => handleDiseaseChange(option.value)}
                    />
                  </div>
                  <p className="checkbox-description">{option.description}</p>
                </div>
              ))}
            </div>
            
            <div className="note">
              <p>* Opsional: Jika tidak ada, bisa langsung lanjut ke step berikutnya</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content fade-in">
            <h2 className="step-title">Asesmen Sudah Terisi, Yakin untuk Mengirimnya?</h2>
            
            <div className="confirmation-summary">
              <div className="summary-card">
                <h3>Ringkasan Data Anda:</h3>
                <div className="summary-item">
                  <span className="summary-label">Umur:</span>
                  <span className="summary-value">{formData.age} tahun</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Berat Badan:</span>
                  <span className="summary-value">{formData.weight} kg</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tinggi Badan:</span>
                  <span className="summary-value">{formData.height} cm</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tujuan:</span>
                  <span className="summary-value">{formData.goal}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Kondisi Kesehatan:</span>
                  <span className="summary-value">
                    {formData.diseases.length > 0 ? formData.diseases.join(', ') : 'Tidak ada'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button
                className="btn btn-error"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                TIDAK
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner small"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    YA
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="assessment-form">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        {steps.map((step) => {
          const IconComponent = step.icon;
          return (
            <div key={step.number} className="progress-step">
              <div className={`step-number ${
                currentStep === step.number ? 'active' : 
                currentStep > step.number ? 'completed' : 'inactive'
              }`}>
                {currentStep > step.number ? <Check size={20} /> : step.number}
              </div>
              <span className="step-label">{step.title}</span>
              {step.number < 4 && (
                <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="form-container">
        <div className="form-card">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="nav-buttons">
              <button
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft size={18} />
                Previous Step
              </button>
              <button
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next Step
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .assessment-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .progress-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step-number.active {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .step-number.completed {
          background: var(--success-color);
          color: white;
        }

        .step-number.inactive {
          background: var(--border-color);
          color: var(--text-muted);
        }

        .step-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          text-align: center;
        }

        .step-line {
          width: 80px;
          height: 3px;
          background: var(--border-color);
          position: absolute;
          top: 25px;
          left: 100%;
          z-index: -1;
        }

        .step-line.completed {
          background: var(--success-color);
        }

        .form-container {
          display: flex;
          justify-content: center;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 600px;
        }

        .step-content {
          margin-bottom: 40px;
        }

        .step-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          text-align: center;
        }

        .step-description {
          font-size: 16px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 32px;
        }

        .form-grid {
          display: grid;
          gap: 24px;
        }

        .options-grid,
        .checkbox-grid {
          display: grid;
          gap: 16px;
        }

        .option-card,
        .checkbox-card {
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .option-card:hover,
        .checkbox-card:hover {
          border-color: var(--primary-color);
          background: rgba(102, 126, 234, 0.05);
        }

        .option-card.selected,
        .checkbox-card.selected {
          border-color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
        }

        .option-header,
        .checkbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .option-title,
        .checkbox-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .option-description,
        .checkbox-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .option-radio input,
        .checkbox-header input {
          transform: scale(1.3);
          margin: 0;
        }

        .note {
          margin-top: 24px;
          text-align: center;
        }

        .note p {
          font-size: 14px;
          color: var(--text-muted);
          font-style: italic;
        }

        .confirmation-summary {
          margin-bottom: 32px;
        }

        .summary-card {
          background: var(--background-light);
          border-radius: 12px;
          padding: 24px;
        }

        .summary-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .summary-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .confirmation-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .confirmation-actions .btn {
          min-width: 120px;
        }

        .spinner.small {
          width: 18px;
          height: 18px;
          border-width: 2px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .assessment-form {
            padding: 20px 16px;
          }

          .form-card {
            padding: 24px;
          }

          .step-title {
            font-size: 24px;
          }

          .progress-indicator {
            gap: 4px;
          }

          .step-line {
            width: 40px;
          }

          .step-number {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .step-label {
            font-size: 12px;
          }

          .nav-buttons {
            flex-direction: column;
          }

          .confirmation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AssessmentForm;