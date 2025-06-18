const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { validateAssessment } = require('../middleware/validation');

// Route: POST /api/v1/assessment (sesuai routing table SOA)
router.post('/', validateAssessment, assessmentController.submitAssessment);

// Route: GET /api/v1/assessment/form (AssessmentFormService)
router.get('/form', assessmentController.getAssessmentForm);

// Route: POST /api/v1/assessment/validate (ValidationService)
router.post('/validate', assessmentController.validateAssessmentData);

// Route: GET /api/v1/assessment/history/:userId (AssessmentHistoryService)
router.get('/history/:userId', assessmentController.getAssessmentHistory);

// Route: GET /api/v1/assessment/:assessmentId
router.get('/:assessmentId', assessmentController.getAssessmentById);

// Route: PUT /api/v1/assessment/:assessmentId
router.put('/:assessmentId', validateAssessment, assessmentController.updateAssessment);

// Route: DELETE /api/v1/assessment/:assessmentId
router.delete('/:assessmentId', assessmentController.deleteAssessment);

module.exports = router;