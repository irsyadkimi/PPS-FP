const express = require('express');
const router = express.Router();

// GET /api/v1/user/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Mock user profile data
    const userProfile = {
      id: 'user_123',
      name: 'John Doe',
      email: 'john.doe@email.com',
      age: 28,
      currentWeight: 70,
      currentHeight: 175,
      targetWeight: 65,
      activityLevel: 'moderate',
      dietaryPreferences: ['no-seafood'],
      allergies: [],
      medicalConditions: ['diabetes'],
      createdAt: '2024-01-15T10:30:00Z',
      lastAssessment: '2024-06-15T14:20:00Z'
    };

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: userProfile
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// PUT /api/v1/user/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const {
      name,
      age,
      currentWeight,
      currentHeight,
      targetWeight,
      activityLevel,
      dietaryPreferences,
      allergies,
      medicalConditions
    } = req.body;

    // Validation
    const errors = [];
    if (age && (age < 10 || age > 100)) errors.push('Age must be between 10 and 100');
    if (currentWeight && (currentWeight < 30 || currentWeight > 300)) errors.push('Weight must be between 30 and 300 kg');
    if (currentHeight && (currentHeight < 100 || currentHeight > 250)) errors.push('Height must be between 100 and 250 cm');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Mock update response
    const updatedProfile = {
      id: 'user_123',
      name: name || 'John Doe',
      age: age || 28,
      currentWeight: currentWeight || 70,
      currentHeight: currentHeight || 175,
      targetWeight: targetWeight || 65,
      activityLevel: activityLevel || 'moderate',
      dietaryPreferences: dietaryPreferences || [],
      allergies: allergies || [],
      medicalConditions: medicalConditions || [],
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
});

// GET /api/v1/user/preferences - Get user diet preferences
router.get('/preferences', async (req, res) => {
  try {
    const preferences = {
      userId: 'user_123',
      currentGoal: 'hidup_sehat',
      preferredMealTypes: ['breakfast', 'lunch', 'dinner'],
      budgetRange: {
        min: 20000,
        max: 50000
      },
      dietaryRestrictions: ['no-seafood'],
      allergies: [],
      preferredCuisines: ['indonesian', 'western'],
      mealsPerDay: 3,
      snacksPerDay: 1,
      notificationSettings: {
        mealReminders: true,
        assessmentReminders: true,
        promotions: false
      }
    };

    res.status(200).json({
      success: true,
      message: 'User preferences retrieved successfully',
      data: preferences
    });

  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user preferences',
      error: error.message
    });
  }
});

// PUT /api/v1/user/preferences - Update user preferences (sesuai routing table SOA)
router.put('/preferences', async (req, res) => {
  try {
    const {
      currentGoal,
      preferredMealTypes,
      budgetRange,
      dietaryRestrictions,
      allergies,
      preferredCuisines,
      mealsPerDay,
      snacksPerDay,
      notificationSettings
    } = req.body;

    // Validation
    const validGoals = ['hidup_sehat', 'diet', 'massa_otot'];
    if (currentGoal && !validGoals.includes(currentGoal)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal. Must be one of: ' + validGoals.join(', ')
      });
    }

    // Mock update
    const updatedPreferences = {
      userId: 'user_123',
      currentGoal: currentGoal || 'hidup_sehat',
      preferredMealTypes: preferredMealTypes || ['breakfast', 'lunch', 'dinner'],
      budgetRange: budgetRange || { min: 20000, max: 50000 },
      dietaryRestrictions: dietaryRestrictions || [],
      allergies: allergies || [],
      preferredCuisines: preferredCuisines || ['indonesian'],
      mealsPerDay: mealsPerDay || 3,
      snacksPerDay: snacksPerDay || 1,
      notificationSettings: notificationSettings || {
        mealReminders: true,
        assessmentReminders: true,
        promotions: false
      },
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      data: updatedPreferences
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user preferences',
      error: error.message
    });
  }
});

// GET /api/v1/user/dashboard - Get user dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = {
      user: {
        name: 'John Doe',
        currentWeight: 70,
        targetWeight: 65,
        progress: 60 // percentage
      },
      recentAssessments: [
        {
          id: 'assess_123',
          date: '2024-06-15',
          bmi: 22.9,
          goal: 'hidup_sehat',
          status: 'completed'
        }
      ],
      currentRecommendations: [
        {
          id: 'meal_1',
          name: 'Paket Sehat Harian',
          calories: 450,
          nextMeal: 'lunch'
        }
      ],
      stats: {
        totalAssessments: 5,
        mealsOrdered: 23,
        currentStreak: 7, // days
        totalCaloriesThisWeek: 3150
      },
      upcomingMeals: [
        {
          time: '12:00',
          meal: 'Lunch - Paket Sehat',
          calories: 450
        },
        {
          time: '19:00', 
          meal: 'Dinner - Paket Diet',
          calories: 380
        }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

module.exports = router;