// Logic untuk analisis diet berdasarkan input user
const analyzeDiet = ({ age, weight, height, goal, diseases }) => {
  
  // Hitung BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let dietType = '';
  let analysis = {};
  let foods = [];
  
  // Analisis berdasarkan penyakit utama
  if (diseases.includes('diabetes')) {
    dietType = 'Diabetes Tipe 2';
    analysis = {
      kondisi: 'Anda teridentifikasi memiliki diabetes tipe 2 dengan pola makan tinggi gula dan karbohidrat sederhana, rendah serat, serta aktivitas fisik terbatas.',
      masalahUtama: [
        'Gula dan nasi putih dikonsumsi berlebih',
        'Sayur dan serat masih kurang', 
        'Jadwal makan belum teratur',
        'Aktivitas fisik minimal'
      ],
      kebutuhanUtama: [
        'Karbohidrat kompleks (misal: nasi merah, oats)',
        'Protein tanpa lemak (ayam tanpa kulit, tahu, tempe)',
        'Sayur tinggi serat',
        'Makanan dengan indeks glikemik rendah',
        'Pola makan teratur'
      ]
    };
    foods = [
      { name: 'Nasi Merah + Ayam Panggang + Sayur Bayam', image: '/images/nasi-merah.jpg' },
      { name: 'Oatmeal + Buah + Kacang Almond', image: '/images/oatmeal.jpg' },
      { name: 'Sup Tahu + Tempe Bacem + Lalapan', image: '/images/sup-tahu.jpg' }
    ];
  } 
  else if (diseases.includes('kolesterol')) {
    dietType = 'Diet Rendah Kolesterol';
    analysis = {
      kondisi: 'Anda memiliki kadar kolesterol tinggi yang memerlukan pengaturan pola makan rendah lemak jenuh.',
      masalahUtama: [
        'Konsumsi lemak jenuh berlebih',
        'Kurang serat larut',
        'Aktivitas fisik kurang'
      ],
      kebutuhanUtama: [
        'Makanan tinggi serat larut',
        'Protein nabati (tahu, tempe, kacang)',
        'Lemak tak jenuh (alpukat, kacang)',
        'Olahraga teratur'
      ]
    };
    foods = [
      { name: 'Salad Alpukat + Tahu + Sayur Hijau', image: '/images/salad-alpukat.jpg' },
      { name: 'Smoothie Oat + Buah + Chia Seed', image: '/images/smoothie.jpg' },
      { name: 'Ikan Panggang + Quinoa + Brokoli', image: '/images/ikan-panggang.jpg' }
    ];
  }
  else if (diseases.includes('darah_tinggi')) {
    dietType = 'Diet DASH (Rendah Sodium)';
    analysis = {
      kondisi: 'Anda memiliki tekanan darah tinggi yang memerlukan pengurangan asupan sodium.',
      masalahUtama: [
        'Konsumsi garam berlebih',
        'Kurang kalium dan magnesium',
        'Stres dan kurang olahraga'
      ],
      kebutuhanUtama: [
        'Makanan rendah sodium',
        'Buah dan sayur tinggi kalium',
        'Whole grains',
        'Protein rendah lemak'
      ]
    };
    foods = [
      { name: 'Pisang + Yogurt + Granola Tanpa Garam', image: '/images/pisang-yogurt.jpg' },
      { name: 'Ayam Rebus + Kentang + Sayur Segar', image: '/images/ayam-rebus.jpg' },
      { name: 'Salmon + Brown Rice + Asparagus', image: '/images/salmon.jpg' }
    ];
  }
  else if (diseases.includes('asam_urat')) {
    dietType = 'Diet Rendah Purin';
    analysis = {
      kondisi: 'Anda memiliki kadar asam urat tinggi yang memerlukan pembatasan makanan tinggi purin.',
      masalahUtama: [
        'Konsumsi makanan tinggi purin',
        'Kurang minum air putih',
        'Berat badan berlebih'
      ],
      kebutuhanUtama: [
        'Makanan rendah purin',
        'Banyak air putih (8-10 gelas/hari)',
        'Buah-buahan segar',
        'Karbohidrat kompleks'
      ]
    };
    foods = [
      { name: 'Nasi Putih + Telur + Sayur Kangkung', image: '/images/nasi-telur.jpg' },
      { name: 'Roti Gandum + Selai Kacang + Pisang', image: '/images/roti-gandum.jpg' },
      { name: 'Bubur Ayam + Sayur + Kerupuk', image: '/images/bubur-ayam.jpg' }
    ];
  }
  else {
    // Tidak ada penyakit, analisis berdasarkan goal dan BMI
    if (goal === 'diet') {
      dietType = 'Diet Sehat untuk Menurunkan Berat Badan';
      analysis = {
        kondisi: `Dengan BMI ${bmi.toFixed(1)}, Anda ingin menurunkan berat badan dengan cara yang sehat.`,
        masalahUtama: [
          'Kalori berlebih',
          'Porsi makan terlalu besar',
          'Kurang aktivitas fisik'
        ],
        kebutuhanUtama: [
          'Defisit kalori 300-500 kal/hari',
          'Protein tinggi untuk mempertahankan massa otot',
          'Serat tinggi untuk kenyang lebih lama',
          'Olahraga kardio dan strength training'
        ]
      };
      foods = [
        { name: 'Salad Protein + Dada Ayam + Quinoa', image: '/images/salad-protein.jpg' },
        { name: 'Greek Yogurt + Berry + Granola', image: '/images/greek-yogurt.jpg' },
        { name: 'Sup Sayur + Tahu + Tempe', image: '/images/sup-sayur.jpg' }
      ];
    }
    else if (goal === 'massa_otot') {
      dietType = 'Diet Bulking untuk Massa Otot';
      analysis = {
        kondisi: `Dengan BMI ${bmi.toFixed(1)}, Anda ingin menambah massa otot dengan surplus kalori yang tepat.`,
        masalahUtama: [
          'Protein kurang mencukupi',
          'Kalori terlalu rendah',
          'Recovery kurang optimal'
        ],
        kebutuhanUtama: [
          'Surplus kalori 200-500 kal/hari',
          'Protein 1.6-2.2g per kg berat badan',
          'Karbohidrat untuk energi workout',
          'Istirahat cukup'
        ]
      };
      foods = [
        { name: 'Nasi + Dada Ayam + Telur + Sayur', image: '/images/nasi-ayam-telur.jpg' },
        { name: 'Protein Shake + Pisang + Oatmeal', image: '/images/protein-shake.jpg' },
        { name: 'Pasta + Salmon + Brokoli', image: '/images/pasta-salmon.jpg' }
      ];
    }
    else { // hidup_sehat
      dietType = 'Pola Makan Sehat dan Seimbang';
      analysis = {
        kondisi: `Dengan BMI ${bmi.toFixed(1)}, Anda ingin mempertahankan pola hidup sehat dan seimbang.`,
        masalahUtama: [
          'Pola makan belum teratur',
          'Kurang variasi nutrisi',
          'Aktivitas fisik minimal'
        ],
        kebutuhanUtama: [
          'Gizi seimbang (karbohidrat, protein, lemak)',
          'Variasi makanan bergizi',
          'Makan teratur 3x + 2 snack',
          'Olahraga rutin 150 menit/minggu'
        ]
      };
      foods = [
        { name: 'Nasi Merah + Ikan + Sayur Campur', image: '/images/nasi-ikan.jpg' },
        { name: 'Smoothie Bowl + Buah + Nuts', image: '/images/smoothie-bowl.jpg' },
        { name: 'Gado-gado + Tahu + Tempe', image: '/images/gado-gado.jpg' }
      ];
    }
  }

  return {
    dietType,
    analysis,
    foods,
    bmi: bmi.toFixed(1)
  };
};

module.exports = {
  analyzeDiet
};
