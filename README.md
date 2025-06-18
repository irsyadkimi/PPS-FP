# Diet Assessment App - PPS Final Project

🥗 **Aplikasi Asesmen Diet untuk Personalisasi Makanan**

Aplikasi web untuk melakukan asesmen diet dan memberikan rekomendasi makanan sehat yang dipersonalisasi berdasarkan kondisi kesehatan, tujuan diet, dan preferensi pengguna.

## 👨‍🎓 Author
**Fausta Irsyad Ramadhan**  
NRP: 5026211150  
Kelas: PPS (A)  
Mata Kuliah: Pemrograman Perangkat Sistem

## 📋 Features

- ✅ **Assessment Form**: Form asesmen lengkap (umur, berat, tinggi, tujuan diet, riwayat penyakit)
- ✅ **Diet Analysis**: Analisis BMI dan rekomendasi diet berdasarkan input pengguna
- ✅ **Personalized Recommendations**: Rekomendasi makanan dan paket diet yang sesuai
- ✅ **Responsive Design**: UI yang responsif untuk desktop dan mobile
- ✅ **RESTful API**: Backend API dengan endpoint lengkap
- ✅ **Docker Support**: Containerized deployment dengan Docker Compose
- ✅ **SOA Architecture**: Service-Oriented Architecture implementation

## 🏗️ Architecture

Aplikasi ini menggunakan **Service-Oriented Architecture (SOA)** dengan pemisahan yang jelas antara frontend dan backend:

### Services Identification
1. **AssessmentFormService** - Menyediakan form asesmen
2. **ValidationService** - Validasi input data
3. **DietAnalysisService** - Analisis data dan rekomendasi
4. **RecommendationService** - Pengelolaan paket makanan
5. **AssessmentHistoryService** - Histori asesmen pengguna
6. **UserProfileService** - Manajemen profil pengguna

### Frontend
- **Framework**: Vite + JavaScript/HTML/CSS
- **Port**: 3000
- **Features**: 
  - Multi-step assessment form
  - Real-time form validation
  - Results dashboard
  - Responsive UI design

### Backend
- **Framework**: Express.js + Node.js
- **Port**: 5000
- **Features**:
  - RESTful API endpoints
  - Assessment data processing
  - BMI calculation
  - Recommendation engine

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### 1. Extract and Setup
```bash
# Extract the application
tar -xzf diet-app.tar.gz
cd diet-app

# Or run the setup script
chmod +x setup.sh
./setup.sh
```

### 2. Run with Docker Compose
```bash
# Start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Assessment Endpoints
```
GET  /api/v1/assessment/form       # Get form structure
POST /api/v1/assessment/validate   # Validate input data
POST /api/v1/assessment/analyze    # Analyze assessment data
GET  /api/v1/assessment/recommendation # Get food recommendations
```

### Service Routing Table
| Route ID | Service | Endpoint | Method | Description |
|----------|---------|----------|---------|-------------|
| 1 | AssessmentFormService | `/api/v1/assessment/form` | GET | Form asesmen |
| 2 | ValidationService | `/api/v1/assessment/validate` | POST | Validasi input |
| 3 | DietAnalysisService | `/api/v1/assessment/analyze` | POST | Analisis diet |
| 4 | RecommendationService | `/api/v1/assessment/recommendation` | GET | Rekomendasi makanan |

## 🗂️ Project Structure

```
pps/
├── diet-app/                 # Main application directory
│   ├── frontend/            # Frontend application
│   │   ├── src/            # Source code
│   │   ├── public/         # Static assets
│   │   ├── package.json    # Frontend dependencies
│   │   └── Dockerfile.frontend
│   ├── backend/            # Backend services (optional)
│   ├── docker-compose.yml  # Docker services configuration
│   ├── Dockerfile.backend  # Backend container
│   └── package.json       # Backend dependencies
├── diet-app.tar.gz         # Compressed application
├── setup.sh               # Setup script
└── README.md              # This documentation
```

## 📊 Use Case: Asesmen Diet untuk Personalisasi Makanan

### Main Flow
1. User login ke sistem
2. User mengisi form asesmen (umur, berat, tinggi, tujuan diet, riwayat penyakit)
3. Sistem memvalidasi kelengkapan data
4. Sistem memproses data untuk menentukan tipe diet yang cocok
5. Sistem menampilkan hasil asesmen dan rekomendasi
6. User dapat memilih paket makanan sesuai rekomendasi

### Business Process Diagram
Aplikasi mengikuti alur proses bisnis yang sistematis dengan validasi di setiap tahap dan memberikan hasil personalisasi berdasarkan input pengguna.

## 🏥 Health Conditions Supported

- ✅ Diabetes
- ✅ Hipertensi (High Blood Pressure)
- ✅ Kolesterol Tinggi
- ✅ Asam Urat
- ✅ Goals: Diet, Massa Otot, Hidup Sehat

## 📈 Performance Metrics

### Assessment Process
- **Throughput**: 13.57 assessment/hari
- **Yield**: 79.17% (95 dari 120 pengguna menyelesaikan assessment)

### Food Ordering Process  
- **Throughput**: 12.86 pemesanan/hari
- **Yield**: 90% (90 dari 100 pesanan berhasil diproses)

## 🛠️ Technology Stack

- **Frontend**: Vite, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Containerization**: Docker, Docker Compose
- **Architecture**: Service-Oriented Architecture (SOA)
- **API**: RESTful API design

## 🔧 Development

### Local Development Setup
```bash
# Install backend dependencies
npm install express cors body-parser

# Start backend
node static_server.js

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables
```bash
# Backend
PORT=5000
NODE_ENV=development

# Frontend
VITE_BACKEND_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports 3000 and 5000 are available
2. **Docker Issues**: Run `docker-compose down` then `docker-compose up --build`
3. **Module Errors**: Run `npm install` in respective directories

### Quick Fixes
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Restart Docker services
docker-compose restart

# View logs
docker-compose logs -f
```

## 📝 Documentation

Project ini dilengkapi dengan:
- Use case diagram dan description
- Business process diagram
- Granular actions table
- Service identification dan routing table
- Arsitektur SOA lengkap

## 🚀 Deployment

Aplikasi ini siap untuk deployment menggunakan Docker Compose. Untuk production:

1. Pastikan Docker dan Docker Compose terinstall
2. Clone repository ini
3. Jalankan `docker-compose up --build -d`
4. Akses aplikasi pada port yang dikonfigurasi

---

**🎯 Goal**: Memberikan rekomendasi diet yang dipersonalisasi melalui asesmen kesehatan yang komprehensif dan analisis data yang akurat.

**📊 Result**: Sistem SOA yang scalable dan modular untuk asesmen diet dengan tingkat keberhasilan tinggi dalam memberikan rekomendasi yang sesuai dengan kebutuhan pengguna.
