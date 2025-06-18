const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// POST /api/v1/assessment - Submit asesmen diet
router.post('/assessment', assessmentController.submitAssessment);

// GET /api/v1/recommendation/:userid - Get rekomendasi berdasarkan user
router.get('/recommendation/:userid', assessmentController.getRecommendation);

// GET /api/v1/assessment/history/:userid - Get histori asesmen user  
router.get('/assessment/history/:userid', assessmentController.getAssessmentHistory);

module.exports = router;
