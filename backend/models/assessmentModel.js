const mongoose = require('mongoose');

// Schema untuk Assessment sesuai dokumentasi SOA
const assessmentSchema = new mongoose.Schema({
  // User identifier
  userId: {
    type: String,
    required: true,
    trim: true,
    index: true // Index untuk query cepat
  },
  
  // Data fisik user
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 100
  },
  
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 300
  },
  
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  
  // Goal diet user
  goal: {
    type: String,
    required: true,
    enum: ['hidup_sehat', 'diet', 'massa_otot'],
    default: 'hidup_sehat'
  },
  
  // Riwayat penyakit (array)
  diseases: [{
    type: String,
    enum: ['diabetes', 'kolesterol', 'asam_urat', 'darah_tinggi']
  }],
  
  // Hasil analisis diet
  dietType: {
    type: String,
    required: true,
    trim: true
  },
  
  // Rekomendasi makanan (array of objects)
  recommendation: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: '/images/default-food.jpg'
    }
  }],
  
  // Hasil analisis lengkap
  analysisResult: {
    kondisi: String,
    masalahUtama: [String],
    kebutuhanUtama: [String],
    bmi: String
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp ketika data diubah
assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index compound untuk query user + tanggal
assessmentSchema.index({ userId: 1, createdAt: -1 });

// Static method untuk mencari asesmen terbaru user
assessmentSchema.statics.findLatestByUser = function(userId) {
  return this.findOne({ userId })
    .sort({ createdAt: -1 })
    .exec();
};

// Instance method untuk format response
assessmentSchema.methods.toClientJSON = function() {
  return {
    id: this._id,
    userId: this.userId,
    dietType: this.dietType,
    foods: this.recommendation,
    analysis: this.analysisResult,
    createdAt: this.createdAt
  };
};

// Virtual untuk menghitung berapa hari sejak asesmen
assessmentSchema.virtual('daysAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialised
assessmentSchema.set('toJSON', { virtuals: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
