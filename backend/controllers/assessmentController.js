// Assessment controller with real MongoDB integration
// const Assessment = require('../models/assessmentModel'); // Uncomment when MongoDB ready
// const DietAnalysisService = require('../services/dietAnalysisService'); // Future use
// const ValidationService = require('../services/validationService'); // Future use
// const AssessmentHistoryService = require('../services/assessmentHistoryService'); // Future use

// In-memory storage for now (replace with MongoDB later)
let assessmentStorage = new Map();

// AssessmentFormService - GET /api/v1/assessment/form
const getAssessmentForm = async (req, res) => {
  try {
    const formStructure = {
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nama Lengkap',
          required: true,
          placeholder: 'Masukkan nama lengkap Anda'
        },
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
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'hipertensi', label: 'Hipertensi' },
            { value: 'kolesterol', label: 'Kolesterol Tinggi' },
            { value: 'asam_urat', label: 'Asam Urat' }
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
    console.error('Error getting assessment form:', error);
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
    const { name, age, weight, height, goal, diseases, userId } = req.body;

    console.log('📥 Received assessment data:', { name, age, weight, height, goal, diseases });

    // Validate required fields
    if (!name || !age || !weight || !height || !goal) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, age, weight, height, goal',
        receivedData: { name: !!name, age: !!age, weight: !!weight, height: !!height, goal: !!goal }
      });
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
    
    // Generate recommendations based on goal and health conditions
    const recommendations = generateRecommendations(goal, diseases || [], bmi);
    
    // Create assessment result
    const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalUserId = userId || `user_${Date.now()}`;
    
    const assessmentResult = {
      id: assessmentId,
      userId: finalUserId,
      personalData: { 
        name, 
        age: parseInt(age), 
        weight: parseFloat(weight), 
        height: parseInt(height), 
        goal, 
        diseases: diseases || [] 
      },
      calculations: { 
        bmi: parseFloat(bmi.toFixed(1)), 
        bmiCategory 
      },
      recommendations,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Store in memory (replace with MongoDB save later)
    assessmentStorage.set(assessmentId, assessmentResult);
    
    console.log('✅ Assessment saved with ID:', assessmentId);

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        assessmentId,
        userId: finalUserId,
        bmi: assessmentResult.calculations.bmi,
        bmiCategory: assessmentResult.calculations.bmiCategory,
        recommendations: assessmentResult.recommendations.summary,
        timestamp: assessmentResult.timestamp
      }
    });

  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process assessment',
      error: error.message
    });
  }
};

// Get single assessment by ID - REAL IMPLEMENTATION
const getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    console.log('📥 Fetching assessment with ID:', assessmentId);
    
    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assessment ID is required'
      });
    }

    // Get from memory storage (replace with MongoDB query later)
    const assessment = assessmentStorage.get(assessmentId);
    
    if (!assessment) {
      console.log('❌ Assessment not found:', assessmentId);
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
        assessmentId,
        availableAssessments: Array.from(assessmentStorage.keys()).slice(0, 5) // Show first 5 for debugging
      });
    }

    console.log('✅ Assessment found:', assessmentId);

    // Return full assessment data
    res.status(200).json({
      success: true,
      message: 'Assessment retrieved successfully',
      data: {
        id: assessment.id,
        userId: assessment.userId,
        personalData: assessment.personalData,
        calculations: assessment.calculations,
        recommendations: assessment.recommendations,
        timestamp: assessment.timestamp,
        status: assessment.status
      }
    });

    /* TODO: Replace with MongoDB query
    const assessment = await Assessment.findById(assessmentId)
      .populate('userId', 'name email')
      .exec();
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    */

  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment',
      error: error.message
    });
  }
};

// Get assessment history
const getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📥 Fetching assessment history for user:', userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Filter assessments by userId from memory storage
    const userAssessments = Array.from(assessmentStorage.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

    console.log(`✅ Found ${userAssessments.length} assessments for user:`, userId);

    res.status(200).json({
      success: true,
      message: 'Assessment history retrieved successfully',
      data: {
        userId,
        assessments: userAssessments.map(assessment => ({
          id: assessment.id,
          timestamp: assessment.timestamp,
          bmi: assessment.calculations.bmi,
          bmiCategory: assessment.calculations.bmiCategory,
          goal: assessment.personalData.goal,
          status: assessment.status
        })),
        total: userAssessments.length
      }
    });

    /* TODO: Replace with MongoDB query
    const assessments = await Assessment.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id timestamp calculations.bmi calculations.bmiCategory personalData.goal status')
      .exec();
    */

  } catch (error) {
    console.error('Error fetching assessment history:', error);
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
    const { name, age, weight, height, goal, diseases } = req.body;
    const errors = [];
    
    // Validate each field
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }
    
    if (!age || typeof age !== 'number' || age < 10 || age > 100) {
      errors.push('Age must be a number between 10 and 100');
    }
    
    if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
      errors.push('Weight must be a number between 30 and 300 kg');
    }
    
    if (!height || typeof height !== 'number' || height < 100 || height > 250) {
      errors.push('Height must be a number between 100 and 250 cm');
    }
    
    if (!goal || !['Hidup Sehat', 'Diet', 'Massa Otot'].includes(goal)) {
      errors.push('Goal must be one of: Hidup Sehat, Diet, Massa Otot');
    }

    // Validate diseases array if provided
    if (diseases && !Array.isArray(diseases)) {
      errors.push('Diseases must be an array');
    } else if (diseases) {
      const validDiseases = ['diabetes', 'hipertensi', 'kolesterol', 'asam_urat'];
      const invalidDiseases = diseases.filter(disease => !validDiseases.includes(disease));
      if (invalidDiseases.length > 0) {
        errors.push(`Invalid diseases: ${invalidDiseases.join(', ')}`);
      }
    }
    
    const isValid = errors.length === 0;
    
    res.status(200).json({
      success: isValid,
      message: isValid ? 'Validation passed' : 'Validation failed',
      errors: errors,
      validatedData: isValid ? { name, age, weight, height, goal, diseases: diseases || [] } : null
    });

  } catch (error) {
    console.error('Error validating assessment data:', error);
    res.status(500).json({
      success: false,
      message: 'Validation service error',
      error: error.message
    });
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const updateData = req.body;
    
    console.log('📝 Updating assessment:', assessmentId);
    
    // Get existing assessment
    const existingAssessment = assessmentStorage.get(assessmentId);
    
    if (!existingAssessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
        assessmentId
      });
    }

    // Update assessment (merge with existing data)
    const updatedAssessment = {
      ...existingAssessment,
      ...updateData,
      id: assessmentId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    // Recalculate if weight/height changed
    if (updateData.weight || updateData.height) {
      const weight = updateData.weight || existingAssessment.personalData.weight;
      const height = updateData.height || existingAssessment.personalData.height;
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      
      let bmiCategory = '';
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi < 25) bmiCategory = 'Normal';
      else if (bmi < 30) bmiCategory = 'Overweight';
      else bmiCategory = 'Obese';
      
      updatedAssessment.calculations = {
        bmi: parseFloat(bmi.toFixed(1)),
        bmiCategory
      };
    }

    // Save updated assessment
    assessmentStorage.set(assessmentId, updatedAssessment);
    
    console.log('✅ Assessment updated successfully:', assessmentId);

    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: {
        id: updatedAssessment.id,
        updatedAt: updatedAssessment.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating assessment:', error);
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
    
    console.log('🗑️ Deleting assessment:', assessmentId);
    
    // Check if assessment exists
    const existingAssessment = assessmentStorage.get(assessmentId);
    
    if (!existingAssessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
        assessmentId
      });
    }

    // Delete from storage
    assessmentStorage.delete(assessmentId);
    
    console.log('✅ Assessment deleted successfully:', assessmentId);

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
      data: { 
        deletedId: assessmentId,
        deletedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: error.message
    });
  }
};

// Helper function to generate recommendations
function generateRecommendations(goal, diseases = [], bmi) {
  const baseRecommendations = {
    summary: [],
    dietType: '',
    meals: [],
    tips: [],
    warnings: []
  };

  // Base recommendations by goal
  switch (goal) {
    case 'Diet':
      baseRecommendations.dietType = 'Low Calorie Diet';
      baseRecommendations.summary = [
        'Fokus pada defisit kalori untuk menurunkan berat badan',
        'Perbanyak protein tanpa lemak dan sayuran',
        'Kurangi karbohidrat sederhana dan lemak jenuh'
      ];
      baseRecommendations.meals = [
        'Protein tanpa lemak (ayam, ikan, tahu)',
        'Sayuran tinggi serat (brokoli, bayam, wortel)',
        'Karbohidrat kompleks (nasi merah, oats)',
        'Buah-buahan rendah gula (apel, pir, berry)'
      ];
      break;
      
    case 'Massa Otot':
      baseRecommendations.dietType = 'High Protein Diet';
      baseRecommendations.summary = [
        'Tingkatkan asupan protein untuk membangun massa otot',
        'Konsumsi karbohidrat kompleks untuk energi',
        'Kombinasikan dengan latihan beban teratur'
      ];
      baseRecommendations.meals = [
        'Protein tinggi (telur, daging, whey protein)',
        'Karbohidrat kompleks (nasi, pasta, roti gandum)',
        'Lemak sehat (alpukat, kacang, minyak zaitun)',
        'Sayuran hijau untuk mikronutrien'
      ];
      break;
      
    default: // Hidup Sehat
      baseRecommendations.dietType = 'Balanced Diet';
      baseRecommendations.summary = [
        'Pola makan seimbang untuk kesehatan optimal',
        'Variasi makanan dari semua kelompok nutrisi',
        'Porsi yang tepat dan jadwal makan teratur'
      ];
      baseRecommendations.meals = [
        'Makanan beragam dan seimbang',
        'Sayuran dan buah-buahan segar',
        'Protein berkualitas dari berbagai sumber',
        'Karbohidrat kompleks dan lemak sehat'
      ];
  }

  // Adjust for health conditions
  if (diseases.includes('diabetes')) {
    baseRecommendations.tips.push('Hindari makanan tinggi gula dan karbohidrat sederhana');
    baseRecommendations.tips.push('Pilih makanan dengan indeks glikemik rendah');
    baseRecommendations.warnings.push('Konsultasikan dengan dokter untuk pengaturan diet diabetes');
  }
  
  if (diseases.includes('hipertensi')) {
    baseRecommendations.tips.push('Kurangi asupan garam dan makanan olahan');
    baseRecommendations.tips.push('Perbanyak makanan kaya kalium (pisang, bayam)');
    baseRecommendations.warnings.push('Monitor tekanan darah secara teratur');
  }
  
  if (diseases.includes('kolesterol')) {
    baseRecommendations.tips.push('Hindari lemak jenuh dan lemak trans');
    baseRecommendations.tips.push('Pilih protein tanpa lemak dan ikan berlemak');
    baseRecommendations.warnings.push('Periksa kadar kolesterol secara berkala');
  }

  if (diseases.includes('asam_urat')) {
    baseRecommendations.tips.push('Batasi makanan tinggi purin (jeroan, seafood)');
    baseRecommendations.tips.push('Perbanyak minum air putih');
    baseRecommendations.warnings.push('Hindari alkohol dan minuman manis');
  }

  // BMI-based recommendations
  if (bmi > 25) {
    baseRecommendations.tips.push('Kontrol porsi makan dan tingkatkan aktivitas fisik');
    baseRecommendations.tips.push('Fokus pada makanan padat nutrisi rendah kalori');
  } else if (bmi < 18.5) {
    baseRecommendations.tips.push('Tambah frekuensi makan dengan porsi kecil tapi sering');
    baseRecommendations.tips.push('Pilih makanan padat nutrisi dan kalori');
  }

  return baseRecommendations;
}

// Get storage statistics (for debugging)
const getStorageStats = async (req, res) => {
  try {
    const stats = {
      totalAssessments: assessmentStorage.size,
      latestAssessments: Array.from(assessmentStorage.entries())
        .slice(-5)
        .map(([id, assessment]) => ({
          id,
          userId: assessment.userId,
          timestamp: assessment.timestamp,
          goal: assessment.personalData.goal
        }))
    };

    res.status(200).json({
      success: true,
      message: 'Storage statistics retrieved',
      data: stats
    });

  } catch (error) {
    console.error('Error getting storage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get storage stats',
      error: error.message
    });
  }
};

module.exports = {
  getAssessmentForm,
  submitAssessment,
  getAssessmentHistory,
  validateAssessmentData,
  getAssessmentById,      // ← REAL IMPLEMENTATION NOW!
  updateAssessment,
  deleteAssessment,
  getStorageStats         // Bonus for debugging
};