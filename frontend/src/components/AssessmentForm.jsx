import React, { useState } from 'react';
import { submitAssessment } from '../services/api';
import './AssessmentForm.css';

const AssessmentForm = ({ onComplete, isLoading, setIsLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: 'user_' + Date.now(), // Generate simple user ID
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Isi data berikut' },
    { number: 2, title: 'apa goals anda?' },
    { number: 3, title: 'apakah anda mengidap salah satu masalah kesehatan berikut?' },
    { number: 4, title: 'Terima Kasih' }
  ];

  const goalOptions = [
    { value: 'hidup_sehat', label: 'Hidup Sehat' },
    { value: 'diet', label: 'Diet' },
    { value: 'massa_otot', label: 'Massa otot' }
  ];

  const diseaseOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'kolesterol', label: 'Kolesterol' },
    { value: 'asam_urat', label: 'Asam Urat' },
    { value: 'darah_tinggi', label: 'Darah Tinggi' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDiseaseChange = (disease, checked) => {
    setFormData(prev => ({
      ...prev,
      diseases: checked 
        ? [...prev.diseases, disease]
        : prev.diseases.filter(d => d !== disease)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.age || formData.age < 10 || formData.age > 100) {
        newErrors.age = 'Umur harus antara 10-100 tahun';
      }
      if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
        newErrors.weight = 'Berat badan harus antara 20-300 kg';
      }
      if (!formData.height || formData.height < 100 || formData.height > 250) {
        newErrors.height = 'Tinggi badan harus antara 100-250 cm';
      }
    } else if (step === 2) {
      if (!formData.goal) {
        newErrors.goal = 'Silakan pilih tujuan diet Anda';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await submitAssessment(formData);
      setTimeout(() => {
        setIsLoading(false);
        onComplete(result);
      }, 1000); // Small delay for better UX
    } catch (error) {
      setIsLoading(false);
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const renderStepProgress = () => (
    <div className="step-progress">
      {steps.map(step => (
        <div key={step.number} className="step-item">
          <div className={`step-number ${currentStep >= step.number ? 'active' : ''}`}>
            {step.number}
          </div>
          {step.number < steps.length && (
            <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="form-step">
      <h3>Isi data berikut</h3>
      
      <div className="form-group">
        <label>Umur</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="Masukkan umur Anda"
          className={errors.age ? 'error' : ''}
        />
        {errors.age && <span className="error-text">{errors.age}</span>}
      </div>

      <div className="form-group">
        <label>Berat Badan</label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="Masukkan berat badan (kg)"
          className={errors.weight ? 'error' : ''}
        />
        {errors.weight && <span className="error-text">{errors.weight}</span>}
      </div>

      <div className="form-group">
        <label>Tinggi Badan</label>
        <input
          type="number"
          value={formData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          placeholder="Masukkan tinggi badan (cm)"
          className={errors.height ? 'error' : ''}
        />
        {errors.height && <span className="error-text">{errors.height}</span>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleNext} className="btn-next">
          Next step
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>apa goals anda?</h3>
      <p>pilih salah satu dari opsion berikut</p>
      
      <div className="options-grid">
        {goalOptions.map(option => (
          <button
            key={option.value}
            type="button"
            className={`option-button ${formData.goal === option.value ? 'selected' : ''}`}
            onClick={() => handleInputChange('goal', option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {errors.goal && <span className="error-text">{errors.goal}</span>}

      <div className="form-actions">
        <button type="button" onClick={handlePrevious} className="btn-prev">
          Previous step
        </button>
        <button type="button" onClick={handleNext} className="btn-next">
          Next step
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>apakah anda mengidap salah satu masalah kesehatan berikut?</h3>
      <p>pilih satu atau lebih dari option berikut</p>
      
      <div className="options-grid">
        {diseaseOptions.map(option => (
          <button
            key={option.value}
            type="button"
            className={`option-button ${formData.diseases.includes(option.value) ? 'selected' : ''}`}
            onClick={() => handleDiseaseChange(option.value, !formData.diseases.includes(option.value))}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" onClick={handlePrevious} className="btn-prev">
          Previous step
        </button>
        <button type="button" onClick={handleNext} className="btn-next">
          Next step
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step confirmation-step">
      <h3>Terima Kasih</h3>
      <p>Assesmen sudah terisi, yakin untuk mengirimnya?</p>

      <div className="form-actions">
        <button type="button" onClick={handlePrevious} className="btn-cancel">
          TIDAK
        </button>
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'YA'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="assessment-form">
      {renderStepProgress()}
      
      <div className="form-container">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default AssessmentForm;
