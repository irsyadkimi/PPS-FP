// Validation middleware for Diet Assessment API
const mongoose = require('mongoose');

// Main assessment validation middleware
const validateAssessment = (req, res, next) => {
  const { age, weight, height, goal, diseases } = req.body;
  const errors = [];

  // Validate age
  if (!age) {
    errors.push('Age is required');
  } else if (typeof age !== 'number' || age < 10 || age > 100) {
    errors.push('Age must be a number between 10 and 100');
  }

  // Validate weight
  if (!weight) {
    errors.push('Weight is required');
  } else if (typeof weight !== 'number' || weight < 30 || weight > 300) {
    errors.push('Weight must be a number between 30 and 300 kg');
  }

  // Validate height
  if (!height) {
    errors.push('Height is required');
  } else if (typeof height !== 'number' || height < 100 || height > 250) {
    errors.push('Height must be a number between 100 and 250 cm');
  }

  // Validate goal
  const validGoals = ['hidup_sehat', 'diet', 'massa_otot'];
  if (!goal) {
    errors.push('Goal is required');
  } else if (!validGoals.includes(goal)) {
    errors.push(`Goal must be one of: ${validGoals.join(', ')}`);
  }

  // Validate diseases (optional)
  if (diseases) {
    if (!Array.isArray(diseases)) {
      errors.push('Diseases must be an array');
    } else {
      const validDiseases = ['diabetes', 'hipertensi', 'kolesterol', 'asam_urat'];
      const invalidDiseases = diseases.filter(disease => !validDiseases.includes(disease));
      if (invalidDiseases.length > 0) {
        errors.push(`Invalid diseases: ${invalidDiseases.join(', ')}`);
      }
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Add computed BMI to request body
  const bmi = weight / Math.pow(height / 100, 2);
  req.body.bmi = parseFloat(bmi.toFixed(1));

  next();
};

// User preferences validation
const validateUserPreferences = (req, res, next) => {
  const { dietaryRestrictions, allergies, preferredMeals, budgetRange } = req.body;
  const errors = [];

  // Validate dietary restrictions (optional)
  if (dietaryRestrictions && !Array.isArray(dietaryRestrictions)) {
    errors.push('Dietary restrictions must be an array');
  }

  // Validate allergies (optional)
  if (allergies && !Array.isArray(allergies)) {
    errors.push('Allergies must be an array');
  }

  // Validate preferred meals (optional)
  if (preferredMeals && typeof preferredMeals !== 'number') {
    errors.push('Preferred meals must be a number');
  }

  // Validate budget range (optional)
  if (budgetRange && (typeof budgetRange.min !== 'number' || typeof budgetRange.max !== 'number')) {
    errors.push('Budget range must have numeric min and max values');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// MongoDB ObjectId validation
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

// Pagination validation
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page must be greater than 0'
    });
  }
  
  if (limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }
  
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
  
  next();
};

// Request body size validation
const validateBodySize = (req, res, next) => {
  const contentLength = req.get('content-length');
  
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({
      success: false,
      message: 'Request body too large'
    });
  }
  
  next();
};

// Content type validation for JSON
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be application/json'
      });
    }
  }
  
  next();
};

// Rate limiting validation (basic implementation)
const rateLimitStore = new Map();

const validateRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(clientId)) {
      rateLimitStore.set(clientId, { requests: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = rateLimitStore.get(clientId);
    
    if (now > clientData.resetTime) {
      // Reset window
      clientData.requests = 1;
      clientData.resetTime = now + windowMs;
      return next();
    }
    
    if (clientData.requests >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    clientData.requests++;
    next();
  };
};

// Health data validation for specific diseases
const validateHealthData = (req, res, next) => {
  const { bloodSugar, bloodPressure, cholesterolLevel, uricAcid } = req.body;
  const errors = [];

  // Validate blood sugar (for diabetes)
  if (bloodSugar !== undefined) {
    if (typeof bloodSugar !== 'number' || bloodSugar < 50 || bloodSugar > 500) {
      errors.push('Blood sugar must be between 50 and 500 mg/dL');
    }
  }

  // Validate blood pressure (for hypertension)
  if (bloodPressure !== undefined) {
    if (!bloodPressure.systolic || !bloodPressure.diastolic) {
      errors.push('Blood pressure must include both systolic and diastolic values');
    } else if (
      typeof bloodPressure.systolic !== 'number' || 
      typeof bloodPressure.diastolic !== 'number' ||
      bloodPressure.systolic < 70 || bloodPressure.systolic > 200 ||
      bloodPressure.diastolic < 40 || bloodPressure.diastolic > 120
    ) {
      errors.push('Invalid blood pressure values');
    }
  }

  // Validate cholesterol level
  if (cholesterolLevel !== undefined) {
    if (typeof cholesterolLevel !== 'number' || cholesterolLevel < 100 || cholesterolLevel > 400) {
      errors.push('Cholesterol level must be between 100 and 400 mg/dL');
    }
  }

  // Validate uric acid level
  if (uricAcid !== undefined) {
    if (typeof uricAcid !== 'number' || uricAcid < 2 || uricAcid > 15) {
      errors.push('Uric acid level must be between 2 and 15 mg/dL');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Health data validation failed',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateAssessment,
  validateUserPreferences,
  validateObjectId,
  validatePagination,
  validateBodySize,
  validateContentType,
  validateRateLimit,
  validateHealthData
};