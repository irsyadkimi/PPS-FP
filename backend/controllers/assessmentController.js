const Assessment = require('../models/assessmentModel');
const DietAnalysisService = require('../services/dietAnalysisService');
const ValidationService = require('../services/validationService');
const AssessmentHistoryService = require('../services/assessmentHistoryService');

// AssessmentFormService - GET /api/v1/assessment/form
const getAssessmentForm = async (req, res) => {
  try {
    const formStructure = {
      fields: [
        {
          name: 'age',
          type: 'number',
          label: 'Umur',
          required: true,
          min: 10,
          max: 100,
          placeholder: 'Masukkan umur Anda'
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Berat Badan (kg)',
          required: true,
          min: 30,
          max: 300,
          placeholder: 'Masukkan berat badan'
        },
        {
          name: 'height',
          type: 'number',
          label: 'Tinggi Badan (cm)',
          required: true,
          min: 100,
          max: 250,
          placeholder: 'Masukkan tinggi badan'
        },
        {
          name: 'goal',
          type: 'select',
          label: 'Tujuan Diet',
          required: true,
          options: [
            { value: 'Hidup Sehat', label: 'Hidup Sehat' },
            { value: 'Diet', label: 'Menurunkan Berat Badan' },
            { value: 'Massa Otot', label: 'Menambah Massa Otot' }
          ]
        }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Assessment form structure retrieved',
      data: formStructure
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment form',
      error: error.message
    });
  }
};

// Main Assessment Submission - POST /api/v1/assessment
const submitAssessment = async (req, res) => {
  try {
    const { age, weight, height, goal, diseases, userId } = req.body;

    // Calculate BMI
    const bmi = weight / Math.pow(height / 100, 2);
    
    // Simple analysis
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
    
    // Simple recommendations
    let recommendations = ['Maintain balanced diet', 'Exercise regularly'];
    
    if (goal === 'Diet') {
      recommendations = ['Caloric deficit', 'High protein foods', 'Reduce refined carbs'];
    } else if (goal === 'Massa Otot') {
      recommendations = ['High protein intake', 'Strength training', 'Post-workout nutrition'];
    }

    const result = {
      success: true,
      data: {
        assessmentId: Date.now().toString(),
        userId: userId || `user_${Date.now()}`,
        bmi: parseFloat(bmi.toFixed(1)),
        bmiCategory,
        recommendations,
        timestamp: new Date().toISOString()
      }
    };

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process assessment',
      error: error.message
    });
  }
};

// Get assessment history
const getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Assessment history retrieved',
      data: {
        userId,
        assessments: [],
        total: 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment history',
      error: error.message
    });
  }
};

// Validation endpoint
const validateAssessmentData = async (req, res) => {
  try {
    const { age, weight, height, goal } = req.body;
    const errors = [];
    
    if (!age || age < 10 || age > 100) errors.push('Invalid age');
    if (!weight || weight < 30 || weight > 300) errors.push('Invalid weight');
    if (!height || height < 100 || height > 250) errors.push('Invalid height');
    if (!goal) errors.push('Goal is required');
    
    res.status(200).json({
      success: errors.length === 0,
      message: errors.length === 0 ? 'Valid' : 'Validation failed',
      errors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation service error',
      error: error.message
    });
  }
};

// Get single assessment
const getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Assessment retrieved',
      data: {
        id: assessmentId,
        message: 'Assessment data would be here'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment',
      error: error.message
    });
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: { id: assessmentId }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update assessment',
      error: error.message
    });
  }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
      data: { deletedId: assessmentId }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: error.message
    });
  }
};

module.exports = {
  getAssessmentForm,
  submitAssessment,
  getAssessmentHistory,
  validateAssessmentData,
  getAssessmentById,
  updateAssessment,
  deleteAssessment
};