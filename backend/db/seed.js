// backend/db/init/seed.js
// File ini akan dijalankan otomatis saat MongoDB container pertama kali dibuat

// Database: dietapp
db = db.getSiblingDB('dietapp');

// Collection 1: Food Recommendations
db.foodRecommendations.insertMany([
  {
    category: "diabetes",
    foods: [
      {
        name: "Nasi Merah dengan Ayam Panggang",
        calories: 450,
        carbs: 45,
        protein: 35,
        fat: 12,
        fiber: 4,
        glycemicIndex: "medium",
        description: "Karbohidrat kompleks dengan protein tanpa lemak"
      },
      {
        name: "Oatmeal dengan Buah Berry",
        calories: 300,
        carbs: 55,
        protein: 10,
        fat: 6,
        fiber: 8,
        glycemicIndex: "low",
        description: "Sarapan tinggi serat dan antioksidan"
      },
      {
        name: "Salad Sayuran dengan Tahu",
        calories: 250,
        carbs: 15,
        protein: 20,
        fat: 12,
        fiber: 6,
        glycemicIndex: "low",
        description: "Sayuran segar dengan protein nabati"
      }
    ]
  },
  {
    category: "hipertensi",
    foods: [
      {
        name: "Ikan Salmon Panggang",
        calories: 400,
        carbs: 5,
        protein: 40,
        fat: 20,
        sodium: 80,
        potassium: 500,
        description: "Omega-3 tinggi, rendah sodium"
      },
      {
        name: "Sayur Bayam dengan Tempe",
        calories: 200,
        carbs: 12,
        protein: 18,
        fat: 8,
        sodium: 50,
        potassium: 400,
        description: "Tinggi kalium, rendah natrium"
      }
    ]
  },
  {
    category: "kolesterol",
    foods: [
      {
        name: "Quinoa Bowl dengan Alpukat",
        calories: 380,
        carbs: 45,
        protein: 15,
        fat: 18,
        saturatedFat: 3,
        fiber: 10,
        description: "Protein lengkap dengan lemak sehat"
      }
    ]
  },
  {
    category: "diet",
    foods: [
      {
        name: "Salad Protein Rendah Kalori",
        calories: 200,
        carbs: 10,
        protein: 25,
        fat: 8,
        fiber: 5,
        description: "Tinggi protein, rendah kalori"
      }
    ]
  },
  {
    category: "bulking",
    foods: [
      {
        name: "Nasi Putih dengan Daging dan Sayur",
        calories: 650,
        carbs: 60,
        protein: 45,
        fat: 20,
        description: "High calorie untuk gain massa otot"
      }
    ]
  },
  {
    category: "hidup_sehat",
    foods: [
      {
        name: "Bowl Seimbang Harian",
        calories: 500,
        carbs: 50,
        protein: 30,
        fat: 18,
        fiber: 8,
        description: "Nutrisi seimbang untuk maintenance"
      }
    ]
  }
]);

// Collection 2: Diet Plans/Packages
db.dietPackages.insertMany([
  {
    packageName: "Diabetes Care Package",
    targetCondition: ["diabetes"],
    duration: "7 days",
    mealsPerDay: 3,
    totalCalories: 1500,
    price: 350000,
    description: "Paket khusus diabetes dengan kontrol gula ketat",
    features: [
      "Karbohidrat kompleks",
      "Indeks glikemik rendah",
      "Tinggi serat",
      "Kontrol porsi"
    ]
  },
  {
    packageName: "Heart Healthy Package",
    targetCondition: ["hipertensi", "kolesterol"],
    duration: "7 days",
    mealsPerDay: 3,
    totalCalories: 1600,
    price: 380000,
    description: "Paket untuk kesehatan jantung",
    features: [
      "Rendah sodium",
      "Omega-3 tinggi",
      "Antioksidan alami",
      "Lemak sehat"
    ]
  },
  {
    packageName: "Weight Loss Package",
    targetCondition: ["diet"],
    duration: "14 days",
    mealsPerDay: 4,
    totalCalories: 1200,
    price: 650000,
    description: "Program penurunan berat badan",
    features: [
      "Kalori terkontrol",
      "Tinggi protein",
      "Rendah lemak",
      "Meal timing optimal"
    ]
  },
  {
    packageName: "Muscle Gain Package",
    targetCondition: ["massa_otot"],
    duration: "7 days",
    mealsPerDay: 5,
    totalCalories: 2200,
    price: 450000,
    description: "Paket untuk menambah massa otot",
    features: [
      "High protein",
      "Kompleks karbohidrat",
      "Pre & post workout meals",
      "Supplement guide"
    ]
  }
]);

// Collection 3: BMI Categories
db.bmiCategories.insertMany([
  {
    category: "underweight",
    minBMI: 0,
    maxBMI: 18.4,
    recommendation: "Perlu menambah berat badan dengan pola makan sehat",
    targetCalories: 2000,
    macroRatio: {
      carbs: 55,
      protein: 20,
      fat: 25
    }
  },
  {
    category: "normal",
    minBMI: 18.5,
    maxBMI: 24.9,
    recommendation: "Pertahankan pola makan seimbang",
    targetCalories: 1800,
    macroRatio: {
      carbs: 50,
      protein: 25,
      fat: 25
    }
  },
  {
    category: "overweight",
    minBMI: 25,
    maxBMI: 29.9,
    recommendation: "Kurangi asupan kalori dan tingkatkan aktivitas fisik",
    targetCalories: 1500,
    macroRatio: {
      carbs: 45,
      protein: 30,
      fat: 25
    }
  },
  {
    category: "obese",
    minBMI: 30,
    maxBMI: 100,
    recommendation: "Konsultasi dengan ahli gizi dan program diet ketat",
    targetCalories: 1200,
    macroRatio: {
      carbs: 40,
      protein: 35,
      fat: 25
    }
  }
]);

// Collection 4: Sample Users (for testing)
db.users.insertMany([
  {
    email: "test@example.com",
    name: "Test User",
    assessmentHistory: [
      {
        date: new Date(),
        age: 25,
        weight: 70,
        height: 170,
        bmi: 24.2,
        goal: "hidup_sehat",
        diseases: [],
        recommendations: ["Bowl Seimbang Harian"]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.foodRecommendations.createIndex({ "category": 1 });
db.dietPackages.createIndex({ "targetCondition": 1 });
db.bmiCategories.createIndex({ "minBMI": 1, "maxBMI": 1 });

print("✅ Database seeded successfully!");
print("📊 Collections created:");
print("   - foodRecommendations: " + db.foodRecommendations.count() + " documents");
print("   - dietPackages: " + db.dietPackages.count() + " documents");
print("   - bmiCategories: " + db.bmiCategories.count() + " documents");
print("   - users: " + db.users.count() + " documents");