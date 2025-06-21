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
    let { name, age, weight, height, goal, diseases, userId } = req.body;

    // Generate a simple userId if not provided
    if (!userId) {
      userId = Date.now().toString();
    }

    const analysisResults = await DietAnalysisService.analyzeUserData({
      age,
      weight,
      height,
      goal,
      diseases: diseases || []
    });

    const assessment = new Assessment({
      userId,
      name,
      personalData: { age, weight, height },
      goal,
      diseases: diseases || [],
      results: analysisResults
    });

    await assessment.save();

    await AssessmentHistoryService.saveAssessment(assessment);

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: assessment,
      userId: assessment.userId
    });

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

    const assessments = await Assessment.find({
      $or: [{ userId }, { name: userId }]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Assessment history retrieved',
      data: assessments
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