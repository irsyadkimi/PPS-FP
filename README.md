# Diet Assessment App - PPS Final Project

🥗 **Aplikasi Asesmen Diet untuk Personalisasi Makanan**

Aplikasi web sederhana untuk melakukan asesmen diet dan memberikan rekomendasi makanan sehat berdasarkan input pengguna.

## 👨‍🎓 Author
**Fausta Irsyad Ramadhan**  
NRP: 5026211150  
Kelas: PPS (A)  
Mata Kuliah: Pemrograman Perangkat Sistem

## 📋 Features

- ✅ **Assessment Form**: Form asesmen (umur, berat, tinggi, tujuan diet, riwayat penyakit)
- ✅ **Diet Analysis**: Analisis BMI sederhana dan rekomendasi diet
- ✅ **Simple UI**: Interface yang mudah digunakan
- ✅ **Docker Support**: Deployment dengan Docker Compose

## 🏗️ Architecture

Aplikasi menggunakan arsitektur **frontend-backend sederhana**:

### Backend
- **Framework**: Express.js + Node.js
- **Port**: 5000
- **Database**: MongoDB (opsional)
- **Endpoints**:
  - `POST /api/v1/assessment` - Submit asesmen
  - `GET /api/v1/recommendation/:userid` - Get rekomendasi

### Frontend
- **Framework**: React + Vite
- **Port**: 3000
- **Components**:
  - `AssessmentForm.jsx` - Form input asesmen
  - `ResultDisplay.jsx` - Tampilan hasil
  - `HomePage.jsx` - Halaman utama
  - `AssessmentPage.jsx` - Halaman asesmen

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (untuk development)

### 1. Extract dan Setup
```bash
# Extract aplikasi
tar -xzf diet-app.tar.gz
cd diet-app

# Atau jalankan setup script
chmod +x setup.sh
./setup.sh
```

Setelah mengekstrak projek, salin file contoh environment:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Jalankan dengan Docker
```bash
# Start semua services
docker-compose up --build -d

# Cek status
docker-compose ps

# Lihat logs
docker-compose logs backend
docker-compose logs frontend
```

### 3. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

### Assessment Endpoint
```bash
POST /api/v1/assessment
Content-Type: application/json

{
  "age": 25,
  "weight": 70,
  "height": 170,
  "goal": "Diet",
  "diseases": ["Diabetes"]
}
```

### Recommendation Endpoint
```bash
GET /api/v1/recommendation/:userid
```

## 🗂️ Project Structure

```
diet-app/
├── backend/
│   ├── app.js                    # Main server file
│   ├── routes/
│   │   └── assessmentRoutes.js   # API routes
│   ├── controllers/
│   │   └── assessmentController.js # Business logic
│   ├── models/
│   │   └── assessmentModel.js    # Database schema
│   ├── services/
│   │   └── dietLogic.js          # Diet recommendation logic
│   ├── db/
│   │   └── connection.js         # Database connection
│   ├── package.json              # Backend dependencies
│   └── Dockerfile                # Backend container
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssessmentForm.jsx
│   │   │   └── ResultDisplay.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── AssessmentPage.jsx
│   │   ├── services/
│   │   │   └── api.js             # API calls
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   └── Dockerfile                # Frontend container
├── docker-compose.yml            # Docker services
└── README.md                     # This file
```

## 📊 Flow Aplikasi

1. **User Input**: Pengguna mengisi form asesmen di `AssessmentForm`
2. **Validation**: Frontend validasi input dasar
3. **API Call**: Data dikirim ke backend via `POST /api/v1/assessment`
4. **Processing**: Backend proses data dengan logic sederhana di `dietLogic.js`
5. **BMI Calculation**: Hitung BMI = weight / (height/100)²
6. **Recommendation**: Generate rekomendasi berdasarkan BMI dan goal
7. **Display**: Hasil ditampilkan di `ResultDisplay` component

## 🔧 Development

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (terminal baru)
cd frontend
npm install
npm run dev
```

### Environment Variables
```bash
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dietapp

# Frontend
VITE_API_URL=http://localhost:5000
```

## 🏥 Health Assessment Logic

### BMI Categories:
- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5-24.9
- **Overweight**: BMI 25-29.9
- **Obese**: BMI ≥ 30

### Goals Supported:
- **Diet**: Fokus penurunan berat badan
- **Massa Otot**: Fokus penambahan massa otot
- **Hidup Sehat**: Maintenance berat badan ideal

### Disease Considerations:
- **Diabetes**: Rekomendasi rendah gula
- **Hipertensi**: Rekomendasi rendah garam
- **Kolesterol**: Rekomendasi rendah lemak jenuh
- **Asam Urat**: Hindari makanan tinggi purin

## 🛠️ Technology Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (opsional)
- **Deployment**: Docker, Docker Compose

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "@vitejs/plugin-react": "^4.0.3",
  "vite": "^4.4.5"
}
```

## 🐛 Troubleshooting

### Common Issues:
1. **Port sudah digunakan**: Kill process dengan `lsof -ti:3000 | xargs kill -9`
2. **Docker error**: Restart dengan `docker-compose down && docker-compose up --build`
3. **API tidak connect**: Cek backend running di port 5000

### Debug Commands:
```bash
# Cek container status
docker-compose ps

# Lihat logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart
```

## 📦 **DOCKER ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────┐
│                  DOCKER COMPOSE                        │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   FRONTEND   │ │   BACKEND    │ │   MONGODB    │   │
│  │  React:3000  │ │ Express:5000 │ │    :27017    │   │
│  │              │ │              │ │              │   │
│  │   Vite +     │ │  Node.js +   │ │   Mongo 7.0  │   │
│  │   React      │ │  Express     │ │   + InitDB   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│         │                 │                 │         │
│         └─────────────────┼─────────────────┘         │
│                           │                           │
│               ┌───────────▼──────────┐                │
│               │    SHARED NETWORK    │                │
│               │   diet-app-network   │                │
│               └──────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

## 🎯 **SERVICES YANG RUNNING**

### **MongoDB Container**
- Port: 27017
- Auto-initialized dengan sample data
- Persistent volume untuk data

### **Backend Container**
- Port: 5000
- Express.js + all SOA services
- Health checks built-in

### **Frontend Container**
- Port: 3000
- React + Vite
- Production build ready

## 🚀 **QUICK START**

```bash
# Clone/setup project
git clone <your-repo>
cd PPS-FP

# ONE COMMAND DEPLOYMENT
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000  
# Health:   http://localhost:5000/health
```

## 📋 **DOCKER COMPOSE FEATURES**

- ✅ Multi-service orchestration
- ✅ Automatic service dependencies  
- ✅ Shared networking
- ✅ Volume persistence
- ✅ Health checks
- ✅ Environment configuration
- ✅ Auto-restart policies
- ✅ Build caching

## 🛠️ **MANAGEMENT COMMANDS**

```bash
# Start services
docker-compose up -d

# Stop services  
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Scale services (if needed)
docker-compose up --scale backend=2

# Clean rebuild
docker-compose down --volumes
docker-compose up --build -d
```

## 🚀 Deployment

Aplikasi siap di-deploy dengan Docker Compose:

1. Clone repository
2. Salin file `.env.example` ke `.env` untuk backend dan frontend
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Jalankan `docker-compose up --build -d`
4. Akses aplikasi di port yang dikonfigurasi

---

**🎯 Goal**: Aplikasi asesmen diet sederhana dengan rekomendasi yang dipersonalisasi berdasarkan BMI, tujuan diet, dan kondisi kesehatan pengguna.
