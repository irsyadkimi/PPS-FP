// Predefined meal packages for the demo frontend
// Each array contains simple objects used for rendering cards

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

export const healthyMeals = [
  {
    id: 'healthy1',
    name: 'Bowl Seimbang Harian',
    description: 'Nasi merah, ayam panggang dan sayuran segar',
    calories: 450,
    image: 'https://source.unsplash.com/featured/?healthy,meal',
    tags: ['none']
  },
  {
    id: 'healthy2',
    name: 'Quinoa Bowl Alpukat',
    description: 'Quinoa dengan alpukat dan sayuran warna-warni',
    calories: 380,
    image: 'https://source.unsplash.com/featured/?quinoa,avocado',
    tags: ['none']
  },
  {
    id: 'healthy3',
    name: 'Smoothie Protein Hijau',
    description: 'Smoothie protein dengan sayuran hijau',
    calories: 300,
    image: 'https://source.unsplash.com/featured/?green,smoothie',
    tags: ['none']
  }
];

export const lowcalMeals = [
  {
    id: 'lowcal1',
    name: 'Salad Protein Rendah Kalori',
    description: 'Sayuran segar dengan dada ayam dan quinoa',
    calories: 200,
    image: 'https://source.unsplash.com/featured/?salad,quinoa',
    tags: ['diet', 'diabetes', 'hipertensi']
  },
  {
    id: 'lowcal2',
    name: 'Sup Sayuran',
    description: 'Sup sayuran dengan protein tanpa lemak',
    calories: 180,
    image: 'https://source.unsplash.com/featured/?vegetable,soup',
    tags: ['diet', 'hipertensi']
  },
  {
    id: 'lowcal3',
    name: 'Yogurt Greek Berry',
    description: 'Yogurt rendah lemak dengan buah berry',
    calories: 150,
    image: 'https://source.unsplash.com/featured/?yogurt,berry',
    tags: ['diet', 'diabetes']
  }
];

export const proteinHighMeals = [
  {
    id: 'protein1',
    name: 'Nasi Putih dengan Daging dan Sayur',
    description: 'Menu tinggi kalori untuk menambah massa otot',
    calories: 650,
    image: 'https://source.unsplash.com/featured/?rice,meat',
    tags: ['massa_otot']
  },
  {
    id: 'protein2',
    name: 'Grilled Salmon dengan Brokoli',
    description: 'Salmon panggang disajikan dengan brokoli kukus',
    calories: 520,
    image: 'https://source.unsplash.com/featured/?salmon,broccoli',
    tags: ['massa_otot', 'hipertensi']
  },
  {
    id: 'protein3',
    name: 'Smoothie Protein Pisang',
    description: 'Smoothie protein tinggi dengan pisang',
    calories: 400,
    image: 'https://source.unsplash.com/featured/?protein,smoothie',
    tags: ['massa_otot']
  }
];

/**
 * Return meal package names visible for a goal.
 * @param {string} goal
 * @returns {string[]}
 */
export function getVisibleMealPackages(goal) {
  const map = {
    hidup_sehat: ['healthy'],
    diet: ['lowcal'],
    massa_otot: ['protein_high']
  };
  return map[goal] ? [...map[goal]] : [];
}

/**
 * Filter meal objects by disease tags. A meal is included if it contains
 * any of the provided disease tags or has the tag "none".
 * @param {Array} mealList Array of meal objects
 * @param {string[]} diseases List of disease identifiers
 * @returns {Array}
 */
export function filterMealsByDiseases(mealList, diseases = []) {
  if (!diseases || diseases.length === 0) {
    return mealList.filter(m => m.tags.includes('none'));
  }
  return mealList.filter(m => {
    if (m.tags.includes('none')) return true;
    return diseases.some(d => m.tags.includes(d));
  });
}

/**
 * Utility to get meals for a user based on goal and diseases.
 * Combines visible packages and applies filtering.
 * @param {string} goal
 * @param {string[]} diseases
 * @returns {Array}
 */
export function getMealsForUser(goal, diseases = []) {
  const packages = getVisibleMealPackages(goal);
  let meals = [];
  if (packages.includes('healthy')) meals = meals.concat(healthyMeals);
  if (packages.includes('lowcal')) meals = meals.concat(lowcalMeals);
  if (packages.includes('protein_high')) meals = meals.concat(proteinHighMeals);
  return filterMealsByDiseases(meals, diseases).slice(0, 4);
}

export default mealRecommendations;