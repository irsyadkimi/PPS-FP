import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    diseases: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assessment-form">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="weight">Weight (kg)</label>
        <input
          id="weight"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="height">Height (cm)</label>
        <input
          id="height"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="goal">Goal</label>
        <input
          id="goal"
          name="goal"
          type="text"
          value={formData.goal}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="diseases">Diseases</label>
        <input
          id="diseases"
          name="diseases"
          type="text"
          value={formData.diseases}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AssessmentForm;
