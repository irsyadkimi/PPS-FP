const mongoose = require('mongoose');

// Personal Data Sub-schema
const personalDataSchema = new mongoose.Schema({
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 100
  },
  weight: {
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  }
}, { _id: false });

// Analysis Results Sub-schema
const analysisSchema = new mongoose.Schema({
  bmi: {
    type: Number,
    required: true
  },
  bmiCategory: {
    type: String,
    required: true,
    enum: ['Underweight', 'Normal', 'Overweight', 'Obese']
  },
  idealWeight: {
    type: Number,
    required: true
  },
  weightDifference: {
    type: Number,
    required: true
  },
  dailyCalories: {
    type: Number,
    required: true
  }
}, { _id: false });

// Recommendations Sub-schema
const recommendationsSchema = new mongoose.Schema({
  primary: [{
    type: String
  }],
  dietary: [{
    type: String
  }],
  lifestyle: [{
    type: String
  }]
}, { _id: false });

// Meal Sub-schema
const mealSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  targetCalories: {
    type: Number,
    required: true
  },
  suggestions: [{
    type: String
  }],
  guidelines: [{
    type: String
  }]
}, { _id: false });

// Meal Plan Sub-schema
const mealPlanSchema = new mongoose.Schema({
  totalCalories: {
    type: Number,
    required: true
  },
  meals: [mealSchema]
}, { _id: false });

// Health Restrictions Sub-schema
const restrictionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Hindari', 'Batasi', 'Recommended']
  },
  items: [{
    type: String
  }],
  reason: {
    type: String,
    required: true
  }
}, { _id: false });

// Results Sub-schema (Complete analysis results)
const resultsSchema = new mongoose.Schema({
  analysis: {
    type: analysisSchema,
    required: true
  },
  recommendations: {
    type: recommendationsSchema,
    required: true
  },
  mealPlan: {
    type: mealPlanSchema,
    required: true
  },
  restrictions: [{
    type: restrictionSchema
  }],
  summary: {
    type: String,
    required: true
  },
  healthScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  nextSteps: [{
    type: String
  }]
}, { _id: false });

// Main Assessment Schema
const assessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  personalData: {
    type: personalDataSchema,
    required: true
  },
  goal: {
    type: String,
    required: true,
    enum: ['hidup_sehat', 'diet', 'massa_otot']
  },
  diseases: [{
    type: String,
    enum: ['diabetes', 'hipertensi', 'kolesterol', 'asam_urat']
  }],
  results: {
    type: resultsSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ name: 1 });
assessmentSchema.index({ 'personalData.weight': 1 });
assessmentSchema.index({ 'personalData.height': 1 });
assessmentSchema.index({ goal: 1 });
assessmentSchema.index({ 'results.analysis.bmiCategory': 1 });
assessmentSchema.index({ createdAt: -1 });
assessmentSchema.index({ status: 1 });

// Virtual for BMI calculation (computed field)
assessmentSchema.virtual('computedBMI').get(function() {
  if (this.personalData && this.personalData.weight && this.personalData.height) {
    const heightInM = this.personalData.height / 100;
    return Math.round((this.personalData.weight / (heightInM * heightInM)) * 10) / 10;
  }
  return null;
});

// Virtual for age group
assessmentSchema.virtual('ageGroup').get(function() {
  if (this.personalData && this.personalData.age) {
    const age = this.personalData.age;
    if (age < 18) return 'Teen';
    if (age < 30) return 'Young Adult';
    if (age < 50) return 'Adult';
    if (age < 65) return 'Middle Age';
    return 'Senior';
  }
  return 'Unknown';
});

// Virtual for days since assessment
assessmentSchema.virtual('daysSinceAssessment').get(function() {
  if (this.createdAt) {
    const now = new Date();
    const diffTime = Math.abs(now - this.createdAt);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Instance methods
assessmentSchema.methods.calculateBMI = function() {
  if (this.personalData.weight && this.personalData.height) {
    const heightInM = this.personalData.height / 100;
    return this.personalData.weight / (heightInM * heightInM);
  }
  return null;
};

assessmentSchema.methods.getBMICategory = function() {
  const bmi = this.calculateBMI();
  if (!bmi) return 'Unknown';
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

assessmentSchema.methods.isHealthyWeight = function() {
  const bmi = this.calculateBMI();
  return bmi && bmi >= 18.5 && bmi < 25;
};

assessmentSchema.methods.hasHealthConditions = function() {
  return this.diseases && this.diseases.length > 0;
};

assessmentSchema.methods.getHealthRisk = function() {
  const bmi = this.calculateBMI();
  const hasConditions = this.hasHealthConditions();
  const age = this.personalData.age;

  let riskScore = 0;

  // BMI risk
  if (bmi < 18.5 || bmi > 30) riskScore += 2;
  else if (bmi > 25) riskScore += 1;

  // Age risk
  if (age > 60) riskScore += 1;
  if (age > 70) riskScore += 1;

  // Disease risk
  if (hasConditions) riskScore += this.diseases.length;

  if (riskScore === 0) return 'Low';
  if (riskScore <= 2) return 'Moderate';
  return 'High';
};

// Static methods
assessmentSchema.statics.findByUserId = function(userId, options = {}) {
  const { limit = 10, sort = { createdAt: -1 } } = options;
  return this.find({ userId, status: 'active' })
    .sort(sort)
    .limit(limit);
};

assessmentSchema.statics.findByGoal = function(goal) {
  return this.find({ goal, status: 'active' });
};

assessmentSchema.statics.findByBMICategory = function(category) {
  return this.find({ 'results.analysis.bmiCategory': category, status: 'active' });
};

assessmentSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalAssessments: { $sum: 1 },
        averageBMI: { $avg: '$results.analysis.bmi' },
        averageAge: { $avg: '$personalData.age' },
        averageWeight: { $avg: '$personalData.weight' },
        averageHeight: { $avg: '$personalData.height' },
        goalDistribution: {
          $push: '$goal'
        },
        bmiCategoryDistribution: {
          $push: '$results.analysis.bmiCategory'
        }
      }
    }
  ]);

  if (stats.length === 0) return null;

  const result = stats[0];
  
  // Count goal distribution
  const goalCounts = {};
  result.goalDistribution.forEach(goal => {
    goalCounts[goal] = (goalCounts[goal] || 0) + 1;
  });

  // Count BMI category distribution
  const bmiCounts = {};
  result.bmiCategoryDistribution.forEach(category => {
    bmiCounts[category] = (bmiCounts[category] || 0) + 1;
  });

  return {
    totalAssessments: result.totalAssessments,
    averages: {
      bmi: Math.round(result.averageBMI * 10) / 10,
      age: Math.round(result.averageAge),
      weight: Math.round(result.averageWeight * 10) / 10,
      height: Math.round(result.averageHeight)
    },
    distributions: {
      goals: goalCounts,
      bmiCategories: bmiCounts
    }
  };
};

assessmentSchema.statics.findRecentAssessments = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    createdAt: { $gte: cutoffDate },
    status: 'active'
  }).sort({ createdAt: -1 });
};

// Pre-save middleware
assessmentSchema.pre('save', function(next) {
  // Ensure BMI is calculated and stored
  if (this.isModified('personalData') || this.isNew) {
    const bmi = this.calculateBMI();
    if (bmi && this.results && this.results.analysis) {
      this.results.analysis.bmi = Math.round(bmi * 10) / 10;
      this.results.analysis.bmiCategory = this.getBMICategory();
    }
  }

  // Update version on modification
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }

  next();
});

// Post-save middleware
assessmentSchema.post('save', function(doc) {
  console.log(`Assessment saved for user ${doc.userId} with ID: ${doc._id}`);
});

// Pre-remove middleware
assessmentSchema.pre('remove', function(next) {
  console.log(`Removing assessment ${this._id} for user ${this.userId}`);
  next();
});

// Validation
assessmentSchema.path('personalData.age').validate(function(value) {
  return value >= 10 && value <= 100;
}, 'Age must be between 10 and 100 years');

assessmentSchema.path('personalData.weight').validate(function(value) {
  return value >= 30 && value <= 300;
}, 'Weight must be between 30 and 300 kg');

assessmentSchema.path('personalData.height').validate(function(value) {
  return value >= 100 && value <= 250;
}, 'Height must be between 100 and 250 cm');

// Custom validation for logical consistency
assessmentSchema.pre('validate', function(next) {
  // Check if BMI makes sense
  if (this.personalData && this.personalData.weight && this.personalData.height) {
    const bmi = this.calculateBMI();
    if (bmi < 10 || bmi > 60) {
      next(new Error('BMI calculation results in unrealistic value. Please check weight and height.'));
      return;
    }
  }

  // Check goal consistency with health conditions
  if (this.goal === 'massa_otot' && this.diseases && this.diseases.includes('diabetes')) {
    // This is just a warning, not an error
    console.warn('User with diabetes choosing muscle gain goal - may need special attention');
  }

  next();
});

// Transform output
assessmentSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive or unnecessary fields
  delete obj.__v;
  
  // Add computed fields
  obj.computedBMI = this.computedBMI;
  obj.ageGroup = this.ageGroup;
  obj.daysSinceAssessment = this.daysSinceAssessment;
  obj.healthRisk = this.getHealthRisk();
  obj.isHealthyWeight = this.isHealthyWeight();

  const goalLabels = {
    hidup_sehat: 'Hidup Sehat',
    diet: 'Diet',
    massa_otot: 'Massa Otot'
  };
  obj.goal = goalLabels[obj.goal] || obj.goal;

  return obj;
};

// Error handling
assessmentSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Assessment data conflict occurred'));
  } else {
    next(error);
  }
});

// Create and export the model
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;