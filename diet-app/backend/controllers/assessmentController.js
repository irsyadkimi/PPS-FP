const Assessment = require('../models/assessmentModel');
const dietLogic = require('../services/dietLogic');
const Joi = require('joi');

// Validasi input asesmen
const assessmentSchema = Joi.object({
  userId: Joi.string().required(),
  age: Joi.number().min(10).max(100).required(),
  weight: Joi.number().min(20).max(300).required(),
  height: Joi.number().min(100).max(250).required(),
  goal: Joi.string().valid('hidup_sehat', 'diet', 'massa_otot').required(),
  diseases: Joi.array().items(Joi.string().valid('diabetes', 'kolesterol', 'asam_urat', 'darah_tinggi')).default([])
});

// Controller untuk submit asesmen
const submitAssessment = async (req, res) => {
  try {
    // Validasi input
    const { error, value } = assessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { userId, age, weight, height, goal, diseases } = value;

    // Proses analisis diet menggunakan service
    const dietAnalysis = dietLogic.analyzeDiet({
      age,
      weight, 
      height,
      goal,
      diseases
    });

    // Simpan ke database
    const assessment = new Assessment({
      userId,
      age,
      weight,
      height, 
      goal,
      diseases,
      dietType: dietAnalysis.dietType,
      recommendation: dietAnalysis.foods,
      analysisResult: dietAnalysis.analysis
    });

    await assessment.save();

    // Response sukses
    res.status(201).json({
      success: true,
      message: 'Asesmen berhasil disimpan',
      data: {
        assessmentId: assessment._id,
        dietType: dietAnalysis.dietType,
        analysis: dietAnalysis.analysis,
        foods: dietAnalysis.foods,
        createdAt: assessment.createdAt
      }
    });

  } catch (error) {
    console.error('Error submit assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Controller untuk get rekomendasi
const getRecommendation = async (req, res) => {
  try {
    const { userid } = req.params;

    // Ambil asesmen terbaru dari user
    const latestAssessment = await Assessment
      .findOne({ userId: userid })
      .sort({ createdAt: -1 })
      .select('dietType recommendation analysisResult createdAt');

    if (!latestAssessment) {
      return res.status(404).json({
        success: false,
        message: 'Asesmen tidak ditemukan. Silakan lakukan asesmen terlebih dahulu.'
      });
    }

    res.json({
      success: true,
      data: {
        dietType: latestAssessment.dietType,
        foods: latestAssessment.recommendation,
        analysis: latestAssessment.analysisResult,
        lastUpdated: latestAssessment.createdAt
      }
    });

  } catch (error) {
    console.error('Error get recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Controller untuk get histori asesmen
const getAssessmentHistory = async (req, res) => {
  try {
    const { userid } = req.params;

    const assessments = await Assessment
      .find({ userId: userid })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('dietType goal diseases createdAt');

    res.json({
      success: true,
      data: assessments
    });

  } catch (error) {
    console.error('Error get assessment history:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

module.exports = {
  submitAssessment,
  getRecommendation,
  getAssessmentHistory
};
