const express = require('express');
const router = express.Router();

// GET /api/v1/recommendation - Get food recommendations based on assessment
router.get('/', async (req, res) => {
  try {
    const { assessmentId, dietType, goal } = req.query;
    
    // Mock data for now - in real app this would query database
    const recommendations = {
      dietType: dietType || 'balanced',
      goal: goal || 'hidup_sehat',
      meals: [
        {
          id: 1,
          name: 'Paket Sehat Harian',
          description: 'Nasi merah, ayam panggang, sayur bayam',
          calories: 450,
          protein: 35,
          carbs: 45,
          fat: 12,
          price: 25000,
          image: '/images/paket-sehat.jpg'
        },
        {
          id: 2,
          name: 'Paket Diet Rendah Kalori',
          description: 'Salad quinoa, dada ayam, brokoli steam',
          calories: 320,
          protein: 28,
          carbs: 25,
          fat: 8,
          price: 30000,
          image: '/images/paket-diet.jpg'
        },
        {
          id: 3,
          name: 'Paket Protein Tinggi',
          description: 'Nasi merah, salmon, tempe bacem',
          calories: 520,
          protein: 42,
          carbs: 48,
          fat: 15,
          price: 35000,
          image: '/images/paket-protein.jpg'
        }
      ],
      totalItems: 3
    };

    res.status(200).json({
      success: true,
      message: 'Food recommendations retrieved successfully',
      data: recommendations
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
});

// GET /api/v1/recommendation/:mealId - Get specific meal details
router.get('/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params;
    
    // Mock meal detail
    const mealDetail = {
      id: mealId,
      name: 'Paket Sehat Harian',
      description: 'Nasi merah, ayam panggang tanpa kulit, sayur bayam, lalapan',
      ingredients: [
        'Nasi merah 150g',
        'Dada ayam panggang 100g',
        'Bayam 80g',
        'Tomat 50g',
        'Timun 30g'
      ],
      nutrition: {
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12,
        fiber: 8,
        sodium: 350
      },
      price: 25000,
      cookingTime: '25 menit',
      difficulty: 'Mudah',
      image: '/images/paket-sehat-detail.jpg',
      tags: ['sehat', 'rendah-lemak', 'tinggi-protein']
    };

    res.status(200).json({
      success: true,
      message: 'Meal details retrieved successfully',
      data: mealDetail
    });

  } catch (error) {
    console.error('Error getting meal details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meal details',
      error: error.message
    });
  }
});

// POST /api/v1/recommendation/filter - Filter recommendations
router.post('/filter', async (req, res) => {
  try {
    const { 
      maxCalories, 
      minProtein, 
      maxPrice, 
      dietaryRestrictions = [],
      allergies = []
    } = req.body;

    // Apply filters to mock data
    let filteredMeals = [
      {
        id: 1,
        name: 'Paket Sehat Harian',
        calories: 450,
        protein: 35,
        price: 25000,
        restrictions: [],
        allergens: []
      },
      {
        id: 2,
        name: 'Paket Vegetarian',
        calories: 380,
        protein: 25,
        price: 22000,
        restrictions: ['vegetarian'],
        allergens: ['nuts']
      }
    ];

    // Filter by criteria
    if (maxCalories) {
      filteredMeals = filteredMeals.filter(meal => meal.calories <= maxCalories);
    }
    
    if (minProtein) {
      filteredMeals = filteredMeals.filter(meal => meal.protein >= minProtein);
    }
    
    if (maxPrice) {
      filteredMeals = filteredMeals.filter(meal => meal.price <= maxPrice);
    }

    res.status(200).json({
      success: true,
      message: 'Filtered recommendations retrieved',
      data: {
        meals: filteredMeals,
        totalItems: filteredMeals.length,
        appliedFilters: {
          maxCalories,
          minProtein,
          maxPrice,
          dietaryRestrictions,
          allergies
        }
      }
    });

  } catch (error) {
    console.error('Error filtering recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter recommendations',
      error: error.message
    });
  }
});

module.exports = router;