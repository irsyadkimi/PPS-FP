class DietAnalysisService {
  
  // Main analysis method
  async analyzeUserData(userData) {
    const { age, weight, height, goal, diseases } = userData;
    
    // Calculate BMI
    const bmi = this.calculateBMI(weight, height);
    const bmiCategory = this.getBMICategory(bmi);
    
    // Calculate ideal weight
    const idealWeight = this.calculateIdealWeight(height);
    
    // Calculate daily calorie needs
    const bmr = this.calculateBMR(age, weight, height, 'male'); // Simplified
    const dailyCalories = this.calculateDailyCalories(bmr, goal, bmiCategory);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(goal, bmiCategory, diseases);
    const mealPlan = this.generateMealPlan(goal, bmiCategory, dailyCalories, diseases);
    const restrictions = this.getHealthRestrictions(diseases);
    
    return {
      analysis: {
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        idealWeight: Math.round(idealWeight * 10) / 10,
        weightDifference: Math.round((weight - idealWeight) * 10) / 10,
        dailyCalories
      },
      recommendations: {
        primary: recommendations.primary,
        dietary: recommendations.dietary,
        lifestyle: recommendations.lifestyle
      },
      mealPlan,
      restrictions,
      summary: this.generateSummary(bmi, bmiCategory, goal, diseases),
      healthScore: this.calculateHealthScore(bmi, age, diseases),
      nextSteps: this.getNextSteps(goal, bmiCategory, diseases)
    };
  }

  // BMI Calculation
  calculateBMI(weight, height) {
    const heightInM = height / 100;
    return weight / (heightInM * heightInM);
  }

  // BMI Category Classification
  getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    return 'Obese';
  }

  // Ideal Weight Calculation (using Broca formula)
  calculateIdealWeight(height) {
    return (height - 100) * 0.9;
  }

  // BMR Calculation (Harris-Benedict equation)
  calculateBMR(age, weight, height, gender = 'male') {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  // Daily Calorie Needs
  calculateDailyCalories(bmr, goal, bmiCategory) {
    let activityMultiplier = 1.4; // Sedentary to light activity
    let goalAdjustment = 0;

    switch (goal) {
      case 'Diet':
        goalAdjustment = bmiCategory === 'Obese' ? -500 : -300;
        break;
      case 'Massa Otot':
        goalAdjustment = bmiCategory === 'Underweight' ? +500 : +300;
        break;
      case 'Hidup Sehat':
        goalAdjustment = 0;
        break;
    }

    return Math.round(bmr * activityMultiplier + goalAdjustment);
  }

  // Generate Recommendations
  generateRecommendations(goal, bmiCategory, diseases) {
    const recommendations = {
      primary: [],
      dietary: [],
      lifestyle: []
    };

    // Goal-based recommendations
    switch (goal) {
      case 'Diet':
        recommendations.primary.push('Fokus pada defisit kalori yang sehat');
        recommendations.dietary.push('Konsumsi protein tinggi untuk menjaga massa otot');
        recommendations.dietary.push('Pilih karbohidrat kompleks dengan indeks glikemik rendah');
        recommendations.lifestyle.push('Olahraga kardio 3-4x seminggu');
        break;
        
      case 'Massa Otot':
        recommendations.primary.push('Tingkatkan asupan protein dan kalori');
        recommendations.dietary.push('Konsumsi 1.6-2.2g protein per kg berat badan');
        recommendations.dietary.push('Makan 5-6 kali sehari dengan porsi lebih sering');
        recommendations.lifestyle.push('Latihan beban 3-4x seminggu');
        break;
        
      case 'Hidup Sehat':
        recommendations.primary.push('Jaga pola makan seimbang dan teratur');
        recommendations.dietary.push('Konsumsi 5 porsi buah dan sayur setiap hari');
        recommendations.lifestyle.push('Olahraga rutin minimal 150 menit per minggu');
        break;
    }

    // BMI-based recommendations
    if (bmiCategory === 'Underweight') {
      recommendations.primary.push('Tingkatkan berat badan secara bertahap');
      recommendations.dietary.push('Makan lebih sering dengan porsi yang cukup');
    } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
      recommendations.primary.push('Turunkan berat badan secara bertahap');
      recommendations.dietary.push('Kurangi kalori dari makanan olahan');
    }

    // Disease-based recommendations
    diseases.forEach(disease => {
      switch (disease) {
        case 'Diabetes':
          recommendations.dietary.push('Batasi gula dan karbohidrat sederhana');
          recommendations.dietary.push('Pilih makanan dengan indeks glikemik rendah');
          recommendations.lifestyle.push('Monitor gula darah secara teratur');
          break;
          
        case 'Hipertensi':
          recommendations.dietary.push('Kurangi asupan garam (< 2300mg/hari)');
          recommendations.dietary.push('Tingkatkan konsumsi kalium dari buah dan sayur');
          recommendations.lifestyle.push('Kelola stress dengan baik');
          break;
          
        case 'Kolesterol':
          recommendations.dietary.push('Batasi lemak jenuh dan trans');
          recommendations.dietary.push('Tingkatkan serat larut dari oats dan kacang-kacangan');
          recommendations.lifestyle.push('Olahraga aerobik secara teratur');
          break;
          
        case 'Asam Urat':
          recommendations.dietary.push('Hindari makanan tinggi purin (jeroan, seafood)');
          recommendations.dietary.push('Minum air putih minimal 8 gelas per hari');
          recommendations.lifestyle.push('Batasi konsumsi alkohol');
          break;
      }
    });

    return recommendations;
  }

  // Generate Meal Plan
  generateMealPlan(goal, bmiCategory, dailyCalories, diseases) {
    const mealDistribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };

    const mealPlan = {
      totalCalories: dailyCalories,
      meals: []
    };

    // Sample meal suggestions based on goal and restrictions
    const mealOptions = this.getMealOptions(goal, diseases);

    Object.keys(mealDistribution).forEach(mealTime => {
      const calories = Math.round(dailyCalories * mealDistribution[mealTime]);
      const meal = {
        time: this.getMealTimeLabel(mealTime),
        targetCalories: calories,
        suggestions: mealOptions[mealTime] || [],
        guidelines: this.getMealGuidelines(mealTime, goal, diseases)
      };
      mealPlan.meals.push(meal);
    });

    return mealPlan;
  }

  // Get meal options based on restrictions
  getMealOptions(goal, diseases) {
    const options = {
      breakfast: [
        'Oatmeal dengan buah dan kacang',
        'Telur rebus dengan roti gandum',
        'Smoothie protein dengan sayuran hijau',
        'Yogurt Greek dengan berry'
      ],
      lunch: [
        'Nasi merah dengan ayam panggang dan sayuran',
        'Salad protein dengan quinoa',
        'Sup sayuran dengan protein tanpa lemak',
        'Ikan bakar dengan kentang rebus'
      ],
      dinner: [
        'Salmon dengan brokoli kukus',
        'Tahu/tempe dengan sayur hijau',
        'Ayam tanpa kulit dengan sayuran panggang',
        'Ikan dengan salad'
      ],
      snack: [
        'Buah segar',
        'Kacang almond',
        'Yogurt rendah lemak',
        'Smoothie sayuran'
      ]
    };

    // Filter based on health conditions
    if (diseases.includes('Diabetes')) {
      // Remove high sugar options
      options.breakfast = options.breakfast.filter(item => !item.includes('buah manis'));
      options.snack = options.snack.filter(item => !item.includes('buah manis'));
    }

    return options;
  }

  // Health restrictions based on diseases
  getHealthRestrictions(diseases) {
    const restrictions = [];

    diseases.forEach(disease => {
      switch (disease) {
        case 'Diabetes':
          restrictions.push({
            type: 'Hindari',
            items: ['Gula tambahan', 'Makanan olahan tinggi gula', 'Minuman manis'],
            reason: 'Dapat meningkatkan gula darah secara drastis'
          });
          break;
          
        case 'Hipertensi':
          restrictions.push({
            type: 'Batasi',
            items: ['Garam berlebih', 'Makanan asin', 'Fast food'],
            reason: 'Dapat meningkatkan tekanan darah'
          });
          break;
          
        case 'Kolesterol':
          restrictions.push({
            type: 'Hindari',
            items: ['Lemak jenuh', 'Makanan gorengan', 'Jeroan'],
            reason: 'Dapat meningkatkan kolesterol LDL'
          });
          break;
          
        case 'Asam Urat':
          restrictions.push({
            type: 'Hindari',
            items: ['Jeroan', 'Seafood tinggi purin', 'Alkohol'],
            reason: 'Dapat memicu serangan asam urat'
          });
          break;
      }
    });

    return restrictions;
  }

  // Generate summary
  generateSummary(bmi, bmiCategory, goal, diseases) {
    let summary = `Berdasarkan analisis, BMI Anda adalah ${Math.round(bmi * 10) / 10} (${bmiCategory}). `;
    
    if (goal === 'Diet' && (bmiCategory === 'Overweight' || bmiCategory === 'Obese')) {
      summary += 'Program penurunan berat badan akan sangat bermanfaat untuk kesehatan Anda. ';
    } else if (goal === 'Massa Otot' && bmiCategory === 'Underweight') {
      summary += 'Program penambahan massa otot akan membantu mencapai berat badan ideal. ';
    }

    if (diseases.length > 0) {
      summary += `Dengan kondisi kesehatan ${diseases.join(', ')}, penting untuk mengikuti panduan diet khusus yang telah disesuaikan.`;
    } else {
      summary += 'Tidak ada kondisi kesehatan khusus yang perlu dipertimbangkan.';
    }

    return summary;
  }

  // Calculate health score
  calculateHealthScore(bmi, age, diseases) {
    let score = 100;

    // BMI impact
    if (bmi < 18.5 || bmi > 30) score -= 20;
    else if (bmi < 20 || bmi > 25) score -= 10;

    // Age impact
    if (age > 50) score -= 5;

    // Disease impact
    score -= diseases.length * 10;

    return Math.max(score, 0);
  }

  // Get next steps
  getNextSteps(goal, bmiCategory, diseases) {
    const steps = [];

    steps.push('Mulai dengan perubahan kecil dalam pola makan');
    steps.push('Tetapkan target yang realistis dan dapat dicapai');
    steps.push('Monitor progress secara berkala');

    if (diseases.length > 0) {
      steps.push('Konsultasi dengan dokter atau ahli gizi');
    }

    steps.push('Lakukan olahraga sesuai kemampuan secara bertahap');

    return steps;
  }

  // Helper methods
  getMealTimeLabel(mealTime) {
    const labels = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Snack'
    };
    return labels[mealTime] || mealTime;
  }

  getMealGuidelines(mealTime, goal, diseases) {
    // Return specific guidelines for each meal time
    const guidelines = {
      breakfast: ['Jangan skip sarapan', 'Sertakan protein dan serat'],
      lunch: ['Porsi terbesar dalam sehari', 'Seimbangkan karbohidrat dan protein'],
      dinner: ['Makan 3 jam sebelum tidur', 'Porsi lebih ringan dari makan siang'],
      snack: ['Pilih snack sehat', 'Hindari makanan olahan']
    };

    return guidelines[mealTime] || [];
  }
}

module.exports = new DietAnalysisService();