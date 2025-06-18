// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('dietapp');

// Create collections
db.createCollection('assessments');
db.createCollection('users');
db.createCollection('recommendations');

// Create indexes for better performance
db.assessments.createIndex({ "userId": 1 });
db.assessments.createIndex({ "createdAt": -1 });
db.users.createIndex({ "email": 1 }, { unique: true });
db.recommendations.createIndex({ "assessmentId": 1 });

// Insert sample food recommendations data
db.foods.insertMany([
  {
    name: "Nasi Merah",
    category: "Karbohidrat",
    calories: 110,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    glycemicIndex: 55,
    suitableFor: ["Diabetes", "Diet", "Hidup Sehat"],
    description: "Karbohidrat kompleks dengan indeks glikemik rendah"
  },
  {
    name: "Ayam Tanpa Kulit",
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    glycemicIndex: 0,
    suitableFor: ["Massa Otot", "Diet", "Hidup Sehat"],
    description: "Protein tinggi, lemak rendah"
  },
  {
    name: "Brokoli",
    category: "Sayuran",
    calories: 25,
    protein: 3,
    carbs: 5,
    fat: 0.3,
    fiber: 2.6,
    glycemicIndex: 10,
    suitableFor: ["Diabetes", "Hipertensi", "Diet", "Hidup Sehat"],
    description: "Tinggi serat, rendah kalori, kaya antioksidan"
  },
  {
    name: "Salmon",
    category: "Protein",
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    glycemicIndex: 0,
    suitableFor: ["Massa Otot", "Hidup Sehat", "Kolesterol"],
    description: "Omega-3 tinggi, baik untuk jantung"
  },
  {
    name: "Oatmeal",
    category: "Karbohidrat",
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    glycemicIndex: 42,
    suitableFor: ["Diabetes", "Kolesterol", "Diet"],
    description: "Serat tinggi, menurunkan kolesterol"
  }
]);

// Insert sample meal plans
db.mealplans.insertMany([
  {
    goal: "Diet",
    bmiCategory: "Overweight",
    dailyCalories: 1500,
    meals: [
      {
        time: "Sarapan",
        foods: ["Oatmeal", "Buah Pisang", "Susu Rendah Lemak"],
        calories: 350
      },
      {
        time: "Makan Siang",
        foods: ["Nasi Merah", "Ayam Tanpa Kulit", "Brokoli", "Tahu"],
        calories: 500
      },
      {
        time: "Makan Malam",
        foods: ["Salmon", "Sayur Bayam", "Kentang Rebus"],
        calories: 450
      },
      {
        time: "Snack",
        foods: ["Yogurt", "Kacang Almond"],
        calories: 200
      }
    ]
  },
  {
    goal: "Massa Otot",
    bmiCategory: "Normal",
    dailyCalories: 2200,
    meals: [
      {
        time: "Sarapan",
        foods: ["Telur", "Roti Gandum", "Avocado", "Susu"],
        calories: 550
      },
      {
        time: "Makan Siang",
        foods: ["Nasi Merah", "Dada Ayam", "Sayuran", "Tempe"],
        calories: 650
      },
      {
        time: "Makan Malam",
        foods: ["Ikan", "Quinoa", "Sayur Hijau"],
        calories: 600
      },
      {
        time: "Snack",
        foods: ["Protein Shake", "Pisang", "Kacang"],
        calories: 400
      }
    ]
  }
]);

print('✅ Database initialized successfully with sample data');
print('📊 Collections created: assessments, users, recommendations, foods, mealplans');
print('🔍 Indexes created for optimized queries');