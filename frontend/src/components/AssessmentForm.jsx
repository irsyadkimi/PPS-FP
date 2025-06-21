import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit, onResult }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  // Inline Styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      color: 'white',
      padding: '30px',
      textAlign: 'center'
    },
    headerTitle: {
      fontSize: '2.5rem',
      margin: '0 0 10px 0',
      fontWeight: '700'
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      margin: '0',
      opacity: '0.9'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      padding: '30px',
      gap: '15px',
      background: '#f8f9fa'
    },
    step: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#666',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem'
    },
    stepActive: {
      background: '#4CAF50',
      color: 'white',
      transform: 'scale(1.1)',
      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
    },
    stepCompleted: {
      background: '#45a049',
      color: 'white'
    },
    content: {
      padding: '40px'
    },
    formStep: {
      minHeight: '300px'
    },
    stepTitle: {
      fontSize: '1.8rem',
      color: '#333',
      marginBottom: '10px',
      textAlign: 'center',
      fontWeight: '600'
    },
    stepSubtitle: {
      color: '#666',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '1.1rem'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#555',
      fontSize: '1rem'
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: '#fafafa',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4CAF50',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
    },
    inputError: {
      borderColor: '#f44336',
      background: '#fff5f5'
    },
    select: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: '#fafafa',
      boxSizing: 'border-box'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    checkboxGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginTop: '10px'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      cursor: 'pointer'
    },
    checkboxItemHover: {
      background: '#e8f5e8',
      borderColor: '#4CAF50'
    },
    checkbox: {
      marginRight: '12px',
      transform: 'scale(1.2)'
    },
    infoBox: {
      background: '#e3f2fd',
      border: '1px solid #bbdefb',
      borderRadius: '10px',
      padding: '15px',
      marginTop: '20px'
    },
    errorMessage: {
      color: '#f44336',
      fontSize: '0.875rem',
      marginTop: '5px',
      display: 'block'
    },
    navigation: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '40px'
    },
    btn: {
      padding: '15px 30px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '140px'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      color: 'white'
    },
    btnSecondary: {
      background: '#6c757d',
      color: 'white'
    },
    btnDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed'
    },
    disclaimer: {
      background: '#fff3cd',
      borderTop: '1px solid #ffeaa7',
      padding: '20px',
      textAlign: 'center'
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        diseases: checked 
          ? [...prev.diseases, value]
          : prev.diseases.filter(disease => disease !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch(currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Nama harus diisi';
        else if (formData.name.trim().length < 2) newErrors.name = 'Nama minimal 2 karakter';
        break;
        
      case 2:
        if (!formData.age) newErrors.age = 'Umur harus diisi';
        else if (formData.age < 10 || formData.age > 100) newErrors.age = 'Umur harus antara 10-100 tahun';
        
        if (!formData.weight) newErrors.weight = 'Berat badan harus diisi';
        else if (formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Berat badan harus antara 30-300 kg';
        
        if (!formData.height) newErrors.height = 'Tinggi badan harus diisi';
        else if (formData.height < 100 || formData.height > 250) newErrors.height = 'Tinggi badan harus antara 100-250 cm';
        break;
        
      case 3:
        if (!formData.goal) newErrors.goal = 'Tujuan diet harus dipilih';
        break;
        
      case 4:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsLoading(true);
    try {
      const result = await onSubmit(formData);
      if (onResult && result.success) {
        onResult(result.data);
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      setErrors({ submit: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={styles.stepIndicator}>
      {[1, 2, 3, 4].map(step => (
        <div 
          key={step}
          style={{
            ...styles.step,
            ...(step < currentStep ? styles.stepCompleted : {}),
            ...(step === currentStep ? styles.stepActive : {})
          }}
        >
          {step < currentStep ? '✓' : step}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div style={styles.formStep}>
      <h2 style={styles.stepTitle}>👤 Informasi Personal</h2>
      <p style={styles.stepSubtitle}>Mari kenali Anda lebih dulu</p>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Nama Lengkap</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Masukkan nama lengkap Anda"
          style={{
            ...styles.input,
            ...(errors.name ? styles.inputError : {})
          }}
        />
        {errors.name && <span style={styles.errorMessage}>{errors.name}</span>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.formStep}>
      <h2 style={styles.stepTitle}>📏 Data Fisik</h2>
      <p style={styles.stepSubtitle}>Data untuk menghitung BMI Anda</p>
      
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Umur (tahun)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="25"
            min="10"
            max="100"
            style={{
              ...styles.input,
              ...(errors.age ? styles.inputError : {})
            }}
          />
          {errors.age && <span style={styles.errorMessage}>{errors.age}</span>}
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Berat (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="70"
            min="30"
            max="300"
            step="0.1"
            style={{
              ...styles.input,
              ...(errors.weight ? styles.inputError : {})
            }}
          />
          {errors.weight && <span style={styles.errorMessage}>{errors.weight}</span>}
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Tinggi Badan (cm)</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          placeholder="170"
          min="100"
          max="250"
          style={{
            ...styles.input,
            ...(errors.height ? styles.inputError : {})
          }}
        />
        {errors.height && <span style={styles.errorMessage}>{errors.height}</span>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={styles.formStep}>
      <h2 style={styles.stepTitle}>🎯 Tujuan Diet</h2>
      <p style={styles.stepSubtitle}>Apa yang ingin Anda capai?</p>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Pilih Tujuan Utama</label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleInputChange}
          style={{
            ...styles.select,
            ...(errors.goal ? styles.inputError : {})
          }}
        >
          <option value="">Pilih tujuan Anda</option>
          <option value="Hidup Sehat">🌱 Hidup Lebih Sehat</option>
          <option value="Diet">⚡ Menurunkan Berat Badan</option>
          <option value="Massa Otot">💪 Menambah Massa Otot</option>
        </select>
        {errors.goal && <span style={styles.errorMessage}>{errors.goal}</span>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={styles.formStep}>
      <h2 style={styles.stepTitle}>🏥 Kondisi Kesehatan</h2>
      <p style={styles.stepSubtitle}>Pilih kondisi yang Anda miliki (opsional)</p>
      
      <div style={styles.checkboxGroup}>
        {['Diabetes', 'Hipertensi', 'Kolesterol', 'Asam Urat'].map(disease => (
          <div key={disease} style={styles.checkboxItem}>
            <input
              type="checkbox"
              id={disease}
              value={disease}
              checked={formData.diseases.includes(disease)}
              onChange={handleInputChange}
              style={styles.checkbox}
            />
            <label htmlFor={disease} style={{ margin: 0, cursor: 'pointer' }}>
              {disease === 'Diabetes' && '🩺'} 
              {disease === 'Hipertensi' && '❤️'} 
              {disease === 'Kolesterol' && '🧪'} 
              {disease === 'Asam Urat' && '🦴'} 
              {' '}{disease}
            </label>
          </div>
        ))}
      </div>
      
      <div style={styles.infoBox}>
        <p style={{ margin: 0, color: '#1976d2', fontSize: '0.95rem' }}>
          💡 <strong>Tips:</strong> Informasi ini akan membantu kami memberikan rekomendasi yang lebih personal dan aman untuk kondisi kesehatan Anda.
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🥗 Diet Assessment</h1>
        <p style={styles.headerSubtitle}>Dapatkan rekomendasi diet personal dalam 4 langkah mudah</p>
      </div>

      {renderStepIndicator()}
      
      <div style={styles.content}>
        {renderCurrentStep()}
        
        {errors.submit && (
          <div style={{
            ...styles.errorMessage,
            background: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            padding: '12px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            {errors.submit}
          </div>
        )}
        
        <div style={styles.navigation}>
          {currentStep > 1 && (
            <button 
              type="button" 
              style={{
                ...styles.btn,
                ...styles.btnSecondary,
                ...(isLoading ? styles.btnDisabled : {})
              }}
              onClick={prevStep}
              disabled={isLoading}
            >
              ⬅️ Sebelumnya
            </button>
          )}
          
          <button 
            type="button" 
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(isLoading ? styles.btnDisabled : {})
            }}
            onClick={nextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              <>⏳ Memproses...</>
            ) : currentStep === totalSteps ? (
              <>📊 Lihat Hasil</>
            ) : (
              <>Lanjut ➡️</>
            )}
          </button>
        </div>
      </div>
      
      <div style={styles.disclaimer}>
        <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
          ⚠️ <em>Hasil assessment ini bersifat informatif dan tidak menggantikan konsultasi medis profesional.</em>
        </p>
      </div>
    </div>
  );
};

export default AssessmentForm;