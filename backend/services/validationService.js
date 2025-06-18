const Joi = require('joi');

class ValidationService {
  
  constructor() {
    // Define validation schemas
    this.assessmentSchema = Joi.object({
      age: Joi.number()
        .integer()
        .min(10)
        .max(100)
        .required()
        .messages({
          'number.base': 'Umur harus berupa angka',
          'number.integer': 'Umur harus berupa bilangan bulat',
          'number.min': 'Umur minimal 10 tahun',
          'number.max': 'Umur maksimal 100 tahun',
          'any.required': 'Umur wajib diisi'
        }),
        
      weight: Joi.number()
        .min(30)
        .max(300)
        .required()
        .messages({
          'number.base': 'Berat badan harus berupa angka',
          'number.min': 'Berat badan minimal 30 kg',
          'number.max': 'Berat badan maksimal 300 kg',
          'any.required': 'Berat badan wajib diisi'
        }),
        
      height: Joi.number()
        .min(100)
        .max(250)
        .required()
        .messages({
          'number.base': 'Tinggi badan harus berupa angka',
          'number.min': 'Tinggi badan minimal 100 cm',
          'number.max': 'Tinggi badan maksimal 250 cm',
          'any.required': 'Tinggi badan wajib diisi'
        }),
        
      goal: Joi.string()
        .valid('Hidup Sehat', 'Diet', 'Massa Otot')
        .required()
        .messages({
          'string.base': 'Tujuan diet harus berupa teks',
          'any.only': 'Tujuan diet harus salah satu dari: Hidup Sehat, Diet, Massa Otot',
          'any.required': 'Tujuan diet wajib dipilih'
        }),
        
      diseases: Joi.array()
        .items(
          Joi.string().valid('Diabetes', 'Hipertensi', 'Kolesterol', 'Asam Urat')
        )
        .optional()
        .messages({
          'array.base': 'Riwayat penyakit harus berupa array',
          'any.only': 'Penyakit harus salah satu dari: Diabetes, Hipertensi, Kolesterol, Asam Urat'
        }),
        
      userId: Joi.string()
        .optional()
        .messages({
          'string.base': 'User ID harus berupa teks'
        })
    });

    this.updateSchema = this.assessmentSchema.fork(
      ['age', 'weight', 'height', 'goal'], 
      (schema) => schema.optional()
    );
  }

  // Main validation method
  async validateInput(data, schema = 'assessment') {
    try {
      let validationSchema;
      
      switch (schema) {
        case 'assessment':
          validationSchema = this.assessmentSchema;
          break;
        case 'update':
          validationSchema = this.updateSchema;
          break;
        default:
          validationSchema = this.assessmentSchema;
      }

      const { error, value } = validationSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        return {
          isValid: false,
          errors: this.formatValidationErrors(error.details),
          data: null
        };
      }

      // Additional business logic validations
      const businessValidation = this.validateBusinessRules(value);
      if (!businessValidation.isValid) {
        return businessValidation;
      }

      return {
        isValid: true,
        errors: [],
        data: value,
        warnings: this.getValidationWarnings(value)
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [{ field: 'general', message: 'Validation service error' }],
        data: null
      };
    }
  }

  // Format Joi validation errors
  formatValidationErrors(details) {
    return details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
  }

  // Business logic validations
  validateBusinessRules(data) {
    const errors = [];
    const warnings = [];

    // BMI validation
    if (data.weight && data.height) {
      const bmi = data.weight / ((data.height / 100) ** 2);
      
      if (bmi < 15) {
        errors.push({
          field: 'bmi',
          message: 'BMI terlalu rendah, mohon periksa kembali data berat dan tinggi badan'
        });
      } else if (bmi > 50) {
        errors.push({
          field: 'bmi',
          message: 'BMI terlalu tinggi, mohon periksa kembali data berat dan tinggi badan'
        });
      } else if (bmi < 16 || bmi > 40) {
        warnings.push({
          field: 'bmi',
          message: 'BMI berada di luar rentang normal, disarankan konsultasi dengan dokter'
        });
      }
    }

    // Age vs disease validation
    if (data.age && data.diseases) {
      if (data.age < 30 && data.diseases.includes('Diabetes')) {
        warnings.push({
          field: 'age_disease',
          message: 'Diabetes di usia muda memerlukan perhatian khusus'
        });
      }

      if (data.age > 60 && data.diseases.length === 0) {
        warnings.push({
          field: 'age_health',
          message: 'Di usia ini, pemeriksaan kesehatan rutin sangat disarankan'
        });
      }
    }

    // Goal vs BMI validation
    if (data.weight && data.height && data.goal) {
      const bmi = data.weight / ((data.height / 100) ** 2);
      
      if (data.goal === 'Diet' && bmi < 25) {
        warnings.push({
          field: 'goal_bmi',
          message: 'BMI Anda normal, pastikan tujuan diet untuk kesehatan, bukan penurunan berat badan drastis'
        });
      }

      if (data.goal === 'Massa Otot' && bmi > 30) {
        warnings.push({
          field: 'goal_bmi',
          message: 'Dengan BMI tinggi, fokus pada penurunan lemak dulu sebelum menambah massa otot'
        });
      }
    }

    // Disease combinations validation
    if (data.diseases && data.diseases.length > 0) {
      const hasMetabolicDiseases = data.diseases.filter(d => 
        ['Diabetes', 'Hipertensi', 'Kolesterol'].includes(d)
      );

      if (hasMetabolicDiseases.length >= 2) {
        warnings.push({
          field: 'diseases',
          message: 'Kombinasi penyakit metabolik memerlukan pengawasan medis ketat'
        });
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        warnings,
        data: null
      };
    }

    return {
      isValid: true,
      errors: [],
      warnings,
      data
    };
  }

  // Get validation warnings
  getValidationWarnings(data) {
    const warnings = [];

    // Check for extreme values
    if (data.age > 70) {
      warnings.push({
        field: 'age',
        message: 'Untuk usia lanjut, konsultasi dengan dokter sangat disarankan'
      });
    }

    if (data.weight && data.height) {
      const bmi = data.weight / ((data.height / 100) ** 2);
      
      if (bmi < 18.5) {
        warnings.push({
          field: 'bmi',
          message: 'BMI menunjukkan berat badan kurang, pertimbangkan program penambahan berat badan'
        });
      } else if (bmi > 30) {
        warnings.push({
          field: 'bmi',
          message: 'BMI menunjukkan obesitas, sangat disarankan konsultasi dengan ahli gizi'
        });
      }
    }

    return warnings;
  }

  // Validate specific fields
  validateAge(age) {
    const schema = Joi.number().integer().min(10).max(100);
    const { error } = schema.validate(age);
    return error ? { isValid: false, message: error.details[0].message } : { isValid: true };
  }

  validateWeight(weight) {
    const schema = Joi.number().min(30).max(300);
    const { error } = schema.validate(weight);
    return error ? { isValid: false, message: error.details[0].message } : { isValid: true };
  }

  validateHeight(height) {
    const schema = Joi.number().min(100).max(250);
    const { error } = schema.validate(height);
    return error ? { isValid: false, message: error.details[0].message } : { isValid: true };
  }

  validateGoal(goal) {
    const schema = Joi.string().valid('Hidup Sehat', 'Diet', 'Massa Otot');
    const { error } = schema.validate(goal);
    return error ? { isValid: false, message: error.details[0].message } : { isValid: true };
  }

  // Sanitize input data
  sanitizeInput(data) {
    const sanitized = { ...data };

    // Trim string values
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key].trim();
      }
    });

    // Ensure diseases is an array
    if (sanitized.diseases && !Array.isArray(sanitized.diseases)) {
      sanitized.diseases = [sanitized.diseases];
    }

    // Remove empty disease entries
    if (sanitized.diseases) {
      sanitized.diseases = sanitized.diseases.filter(disease => disease && disease.trim());
    }

    return sanitized;
  }

  // Get validation summary
  getValidationSummary(data) {
    const summary = {
      totalFields: Object.keys(data).length,
      validFields: 0,
      warnings: 0,
      errors: 0,
      completeness: 0
    };

    // Calculate completeness
    const requiredFields = ['age', 'weight', 'height', 'goal'];
    const filledRequired = requiredFields.filter(field => data[field] !== undefined && data[field] !== null);
    summary.completeness = Math.round((filledRequired.length / requiredFields.length) * 100);

    return summary;
  }
}

module.exports = new ValidationService();