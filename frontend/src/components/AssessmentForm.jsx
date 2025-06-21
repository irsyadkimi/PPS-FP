import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle checkbox changes for diseases
  const handleDiseaseChange = (disease) => {
    setFormData(prev => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter(d => d !== disease)
        : [...prev.diseases, disease]
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.age || formData.age < 10 || formData.age > 100) {
      newErrors.age = 'Umur harus antara 10-100 tahun';
    }
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Berat badan harus antara 30-300 kg';
    }
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Tinggi badan harus antara 100-250 cm';
    }
    if (!formData.goal) newErrors.goal = 'Pilih tujuan diet';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CRITICAL: Handle form submission properly
  const handleSubmitInternal = (e) => {
    e.preventDefault(); // Prevent page reload
    
    console.log('🔥 Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed:', errors);
      return;
    }

    // Convert string to number for backend
    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    };
    
    console.log('✅ Calling onSubmit with:', submitData);
    
    // Call the onSubmit prop from parent component
    if (onSubmit) {
      onSubmit(submitData);
    } else {
      console.error('❌ onSubmit prop not provided!');
    }
  };

  return (
    <div className="assessment-form-container">
      <form onSubmit={handleSubmitInternal} className="assessment-form">
        
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Nama Lengkap *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap"
            className={`form-input ${errors.name ? 'error' : ''}`}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Age Field */}
        <div className="form-group">
          <label htmlFor="age">Umur *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Masukkan umur"
            min="10"
            max="100"
            className={`form-input ${errors.age ? 'error' : ''}`}
            required
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        {/* Weight Field */}
        <div className="form-group">
          <label htmlFor="weight">Berat Badan (kg) *</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Masukkan berat badan"
            min="30"
            max="300"
            step="0.1"
            className={`form-input ${errors.weight ? 'error' : ''}`}
            required
          />
          {errors.weight && <span className="error-message">{errors.weight}</span>}
        </div>

        {/* Height Field */}
        <div className="form-group">
          <label htmlFor="height">Tinggi Badan (cm) *</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="Masukkan tinggi badan"
            min="100"
            max="250"
            className={`form-input ${errors.height ? 'error' : ''}`}
            required
          />
          {errors.height && <span className="error-message">{errors.height}</span>}
        </div>

        {/* Goal Field */}
        <div className="form-group">
          <label htmlFor="goal">Tujuan Diet *</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className={`form-input ${errors.goal ? 'error' : ''}`}
            required
          >
            <option value="">Pilih tujuan diet</option>
            <option value="Hidup Sehat">Hidup Sehat</option>
            <option value="Diet">Menurunkan Berat Badan</option>
            <option value="Massa Otot">Menambah Massa Otot</option>
          </select>
          {errors.goal && <span className="error-message">{errors.goal}</span>}
        </div>

        {/* Diseases Field */}
        <div className="form-group">
          <label>Riwayat Penyakit (Opsional)</label>
          <div className="checkbox-group">
            {[
              { value: 'diabetes', label: 'Diabetes' },
              { value: 'hipertensi', label: 'Hipertensi' },
              { value: 'kolesterol', label: 'Kolesterol Tinggi' },
              { value: 'asam_urat', label: 'Asam Urat' }
            ].map(disease => (
              <label key={disease.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.diseases.includes(disease.value)}
                  onChange={() => handleDiseaseChange(disease.value)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{disease.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Memproses...' : '🚀 Submit Assessment'}
        </button>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <details className="debug-info">
            <summary>🐛 Debug Form Data</summary>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </details>
        )}
      </form>

      <style jsx>{`
        .assessment-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .assessment-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          font-size: 14px;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary-color, #10b981);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: var(--background-light, #f9fafb);
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .checkbox-label:hover {
          color: var(--primary-color, #10b981);
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-color, #10b981);
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 14px;
          font-weight: 500;
        }

        .submit-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, var(--primary-color, #10b981) 0%, var(--secondary-color, #059669) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .submit-button:disabled,
        .submit-button.loading {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .debug-info {
          margin-top: 20px;
          font-size: 12px;
        }

        .debug-info pre {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          overflow: auto;
          margin-top: 8px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .assessment-form-container {
            margin: 0 16px;
            padding: 16px;
          }

          .form-input {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default AssessmentForm;