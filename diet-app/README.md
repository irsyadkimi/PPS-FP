# 🍎 Diet Assessment App

Aplikasi asesmen diet untuk personalisasi makanan berbasis web dengan React & Node.js

## 🚀 Quick Start

```bash
# Clone dan masuk ke directory
cd diet-app

# Jalankan dengan Docker
docker-compose up --build

# Akses aplikasi
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## 📁 Struktur Project

```
diet-app/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite
├── docker-compose.yml
└── README.md
```

## 🔧 Development

```bash
# Backend development
cd backend
npm install
npm run dev

# Frontend development  
cd frontend
npm install
npm run dev
```

## 📋 Features

- ✅ Asesmen diet berdasarkan umur, BB, TB, goal, riwayat penyakit
- ✅ Rekomendasi makanan personal
- ✅ SOA Architecture
- ✅ Docker containerization

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB with Mongoose
- **DevOps**: Docker, Docker Compose
