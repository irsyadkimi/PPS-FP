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

  const { mealPlan = {}, recommendations, restrictions } = assessment.results || {};

    // Flatten meals array and provide defaults if empty
    const meals = Array.isArray(mealPlan.meals) ? [...mealPlan.meals] : [];

    if (meals.length === 0) {
      meals.push(
        {
          id: 'default1',
          name: 'Paket Sehat Harian',
          description: 'Nasi merah, ayam panggang dan sayur bayam',
          calories: 450
        },
        {
          id: 'default2',
          name: 'Salad Quinoa',
          description: 'Quinoa dengan dada ayam dan sayuran segar',
          calories: 350
        },
        {
          id: 'default3',
          name: 'Smoothie Protein',
          description: 'Smoothie protein dengan buah dan sayur',
          calories: 300
        }
      );
    }

    res.status(200).json({
      success: true,
      data: { meals, mealPlan, recommendations, restrictions }
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
