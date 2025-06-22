const mealRecommendations = {
  "diet:diabetes": [
    {
      id: "meal1",
      name: "Oat & Telur Rebus",
      description: "Oatmeal tinggi serat dengan telur rebus dan tomat",
      image: "https://source.unsplash.com/featured/?oatmeal",
      calories: 300
    },
    {
      id: "meal2",
      name: "Salad Ayam",
      description: "Dada ayam panggang dengan sayuran segar",
      image: "https://source.unsplash.com/featured/?chicken,salad",
      calories: 350
    },
    {
      id: "meal3",
      name: "Ikan Bakar",
      description: "Ikan bakar dengan nasi merah",
      image: "https://source.unsplash.com/featured/?grilled,fish",
      calories: 400
    },
    {
      id: "meal4",
      name: "Smoothie Berry",
      description: "Smoothie rendah gula dengan buah berry",
      image: "https://source.unsplash.com/featured/?berry,smoothie",
      calories: 180
    }
  ],
  "diet:hipertensi": [
    {
      id: "meal5",
      name: "Sayur Bayam",
      description: "Tumis bayam rendah garam dengan tahu",
      image: "https://source.unsplash.com/featured/?spinach",
      calories: 250
    },
    {
      id: "meal6",
      name: "Grilled Salmon",
      description: "Salmon panggang dengan brokoli",
      image: "https://source.unsplash.com/featured/?salmon",
      calories: 420
    }
  ],
  "diet:none": [
    {
      id: "meal7",
      name: "Ayam Panggang",
      description: "Ayam panggang dengan salad",
      image: "https://source.unsplash.com/featured/?grilled,chicken",
      calories: 400
    },
    {
      id: "meal8",
      name: "Nasi Merah dan Tempe",
      description: "Paket lengkap nasi merah dengan tempe",
      image: "https://source.unsplash.com/featured/?tempeh",
      calories: 450
    }
  ]
};

export function getMealsForUser(goal, diseases = []) {
  const allMeals = [];
  diseases.forEach(disease => {
    const key = `${goal}:${disease}`;
    if (mealRecommendations[key]) {
      allMeals.push(...mealRecommendations[key]);
    }
  });
  if (allMeals.length === 0 && mealRecommendations[`${goal}:none`]) {
    allMeals.push(...mealRecommendations[`${goal}:none`]);
  }
  const uniqueMeals = [...new Map(allMeals.map(m => [m.id, m])).values()];
  return uniqueMeals.slice(0, 4);
}

export default mealRecommendations;
