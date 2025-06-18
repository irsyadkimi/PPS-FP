const Assessment = require('../models/assessmentModel');
const DietAnalysisService = require('../services/dietAnalysisService');
const ValidationService = require('../services/validationService');
const AssessmentHistoryService = require('../services/assessmentHistoryService');

class AssessmentController {
  
  // AssessmentFormService - GET /api/v1/assessment/form
  async getAssessmentForm(req, res) {
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
          },
          {
            name: 'diseases',
            type: 'checkbox',
            label: 'Riwayat Penyakit',
            required: false,
            options: [
              { value: 'Diabetes', label: 'Diabetes' },
              { value: 'Hipertensi', label: 'Darah Tinggi' },
              { value: 'Kolesterol', label: 'Kolesterol Tinggi' },
              { value: 'Asam Urat', label: 'Asam Urat' }
            ]
          }
        ],
        steps: [
          {
            title: 'Data Pribadi',
            fields: ['age', 'weight', 'height']
          },
          {
            title: 'Tujuan Diet',
            fields: ['goal']
          },
          {
            title: 'Riwayat Kesehatan',
            fields: ['diseases']
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
  }

  // ValidationService - POST /api/v1/assessment/validate
  async validateAssessmentData(req, res) {
    try {
      const validationResult = await ValidationService.validateInput(req.body);
      
      if (validationResult.isValid) {
        res.status(200).json({
          success: true,
          message: 'Assessment data is valid',
          data: validationResult
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.errors
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Validation service error',
        error: error.message
      });
    }
  }

  // Main Assessment Submission - POST /api/v1/assessment
  async submitAssessment(req, res) {
    try {
      const { age, weight, height, goal, diseases, userId } = req.body;

      // Step 1: Validate input data
      const validationResult = await ValidationService.validateInput(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validationResult.errors
        });
      }

      // Step 2: Process assessment with DietAnalysisService
      const analysisResult = await DietAnalysisService.analyzeUserData({
        age,
        weight,
        height,
        goal,
        diseases: diseases || []
      });

      // Step 3: Create assessment record
      const assessmentData = {
        userId: userId || `user_${Date.now()}`,
        personalData: { age, weight, height },
        goal,
        diseases: diseases || [],
        results: analysisResult,
        createdAt: new Date()
      };

      const assessment = new Assessment(assessmentData);
      const savedAssessment = await assessment.save();

      // Step 4: Save to history
      await AssessmentHistoryService.saveAssessment(savedAssessment);

      res.status(201).json({
        success: true,
        message: 'Assessment completed successfully',
        data: {
          assessmentId: savedAssessment._id,
          userId: savedAssessment.userId,
          results: analysisResult,
          timestamp: savedAssessment.createdAt
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to process assessment',
        error: error.message
      });
    }
  }

  // AssessmentHistoryService - GET /api/v1/assessment/history/:userId
  async getAssessmentHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const history = await AssessmentHistoryService.getUserHistory(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        message: 'Assessment history retrieved',
        data: history
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get assessment history',
        error: error.message
      });
    }
  }

  // Get single assessment - GET /api/v1/assessment/:assessmentId
  async getAssessmentById(req, res) {
    try {
      const { assessmentId } = req.params;

      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Assessment retrieved',
        data: assessment
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get assessment',
        error: error.message
      });
    }
  }

  // Update assessment - PUT /api/v1/assessment/:assessmentId
  async updateAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const updateData = req.body;

      // Validate update data
      const validationResult = await ValidationService.validateInput(updateData);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid update data',
          errors: validationResult.errors
        });
      }

      // Re-analyze if personal data changed
      if (updateData.age || updateData.weight || updateData.height || updateData.goal) {
        const analysisResult = await DietAnalysisService.analyzeUserData({
          age: updateData.age,
          weight: updateData.weight,
          height: updateData.height,
          goal: updateData.goal,
          diseases: updateData.diseases || []
        });
        updateData.results = analysisResult;
      }

      updateData.updatedAt = new Date();

      const updatedAssessment = await Assessment.findByIdAndUpdate(
        assessmentId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAssessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Assessment updated successfully',
        data: updatedAssessment
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update assessment',
        error: error.message
      });
    }
  }

  // Delete assessment - DELETE /api/v1/assessment/:assessmentId
  async deleteAssessment(req, res) {
    try {
      const { assessmentId } = req.params;

      const deletedAssessment = await Assessment.findByIdAndDelete(assessmentId);
      if (!deletedAssessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

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
  }
}

module.exports = new AssessmentController();