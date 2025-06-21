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
    const { name, value, selectedOptions } = e.target;
    if (name === 'diseases') {
      const values = Array.from(selectedOptions).map((o) => o.value);
      setFormData((prev) => ({ ...prev, diseases: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (onSubmit) {
      const processedData = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height)
      };
      onSubmit(processedData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <form onSubmit={handleNext} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      {step === 1 && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              required
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              required
            />
          </div>
        </>
      )}

      {step === 3 && (
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="goal">Goal</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            required
          >
            <option value="">Pilih Goal</option>
            <option value="hidup_sehat">Hidup Sehat</option>
            <option value="diet">Diet</option>
            <option value="massa_otot">Menambah Massa Otot</option>
            <option value="hindari_penyakit">Menghindari Penyakit</option>
          </select>
        </div>
      )}

      {step === 4 && (
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="diseases">Diseases</label>
          <select
            id="diseases"
            name="diseases"
            multiple
            value={formData.diseases}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="Diabetes">Diabetes</option>
            <option value="Hipertensi">Darah Tinggi</option>
            <option value="Kolesterol">Kolesterol</option>
            <option value="Asam Urat">Asam Urat</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {step > 1 && (
          <button type="button" onClick={handleBack}
            style={{ padding: '8px 16px' }}>
            Back
          </button>
        )}
        <button type="submit" style={{ padding: '8px 16px', marginLeft: 'auto' }}>
          {step < totalSteps ? 'Next' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AssessmentForm;
