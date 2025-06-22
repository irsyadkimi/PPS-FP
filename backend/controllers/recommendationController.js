const Assessment = require('../models/assessmentModel');

const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const assessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found for this user'
      });
    }

    const { mealPlan, recommendations, restrictions } = assessment.results || {};

    res.status(200).json({
      success: true,
      data: { mealPlan, recommendations, restrictions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user recommendations',
      error: error.message
    });
  }
};

module.exports = { getUserRecommendations };
