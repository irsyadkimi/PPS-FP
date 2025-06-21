import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle diseases checkboxes
      setFormData(prev => ({
        ...prev,
        diseases: checked 
          ? [...prev.diseases, value]
          : prev.diseases.filter(d => d !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    // Validate current step
    if (!validateCurrentStep()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (onSubmit) {
      // Transform data to match backend expectations
      const processedData = {
        name: formData.name,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        goal: formData.goal, // Keep as is - backend will handle
        diseases: formData.diseases // Array of strings
      };
      
      console.log('🚀 Submitting processed data:', processedData);
      onSubmit(processedData);
    }
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.age && formData.age >= 10 && formData.age <= 100;
      case 2:
        return formData.weight && formData.weight >= 30 && formData.weight <= 300 &&
               formData.height && formData.height >= 100 && formData.height <= 250;
      case 3:
        return formData.goal;
      case 4:
        return true; // Diseases are optional
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="assessment-form-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="step-info">
        <h2>Step {step} of {totalSteps}</h2>
      </div>

      <form onSubmit={handleNext} className="assessment-form">
        {step === 1 && (
          <div className="step-content">
            <h3>👋 Informasi Personal</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Umur *</label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Masukkan umur (10-100 tahun)"
                min="10"
                max="100"
                className="form-input"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3>📏 Data Fisik</h3>
            
            <div className="form-group">
              <label htmlFor="weight">Berat Badan (kg) *</label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Masukkan berat badan"
                min="30"
                max="300"
                step="0.1"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Tinggi Badan (cm) *</label>
              <input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="Masukkan tinggi badan"
                min="100"
                max="250"
                className="form-input"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3>🎯 Tujuan Diet</h3>
            
            <div className="form-group">
              <label htmlFor="goal">Pilih Tujuan Diet Anda *</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Pilih tujuan diet</option>
                <option value="hidup_sehat">Hidup Sehat</option>
                <option value="diet">Menurunkan Berat Badan</option>
                <option value="massa_otot">Menambah Massa Otot</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h3>🏥 Riwayat Kesehatan</h3>
            <p>Pilih kondisi kesehatan yang Anda miliki (opsional):</p>
            
            <div className="checkbox-group">
              {[
                { value: 'diabetes', label: 'Diabetes' },
                { value: 'hipertensi', label: 'Hipertensi (Darah Tinggi)' },
                { value: 'kolesterol', label: 'Kolesterol Tinggi' },
                { value: 'asam_urat', label: 'Asam Urat' }
              ].map(disease => (
                <label key={disease.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="diseases"
                    value={disease.value}
                    checked={formData.diseases.includes(disease.value)}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">{disease.label}</span>
                </label>
              ))}
            </div>
            
            {formData.diseases.length === 0 && (
              <p className="info-text">✅ Tidak ada kondisi khusus</p>
            )}
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              ← Back
            </button>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ marginLeft: step === 1 ? 'auto' : '12px' }}
          >
            {step < totalSteps ? 'Next →' : '🚀 Submit Assessment'}
          </button>
        </div>

        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <details className="debug-panel">
            <summary>🐛 Debug Form Data</summary>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <p><strong>Current Step Valid:</strong> {validateCurrentStep() ? 'Yes' : 'No'}</p>
          </details>
        )}
      </form>

      <style jsx>{`
        .assessment-form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .step-info {
          text-align: center;
          margin-bottom: 32px;
        }

        .step-info h2 {
          font-size: 18px;
          font-weight: 600;
          color: #6b7280;
          margin: 0;
        }

        .assessment-form {
          display: flex;
          flex-direction: column;
        }

        .step-content {
          margin-bottom: 32px;
        }

        .step-content h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-top: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .checkbox-label:hover {
          background: #f3f4f6;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #10b981;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .info-text {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin-top: 12px;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .debug-panel {
          margin-top: 24px;
          font-size: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
        }

        .debug-panel pre {
          background: #f9fafb;
          padding: 8px;
          border-radius: 4px;
          overflow: auto;
          margin-top: 8px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .assessment-form-container {
            margin: 0 16px;
            padding: 16px;
          }

          .step-content h3 {
            font-size: 20px;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AssessmentForm;