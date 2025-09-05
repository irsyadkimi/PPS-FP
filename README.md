# Diet Apps

🥗 **Diet Assessment App for Personalized Meals**

A simple web app for diet assessment and healthy meal recommendations based on user input.

## 👨‍🎓 Author
**Fausta Irsyad Ramadhan**  
NRP: 5026211150  
Class: PPS (A)  
Course: System Programming

## 📋 Features

- ✅ **Assessment Form** – collects age, weight, height, diet goal, and disease history.
- ✅ **Diet Analysis** – calculates BMI and offers diet recommendations.
- ✅ **Simple UI** – intuitive and easy to use.
- ✅ **Docker Support** – deploy with Docker Compose.

## 🏗️ Architecture

The project uses a straightforward **frontend–backend** design.

### Backend
- **Framework:** Express.js + Node.js  
- **Port:** 5000  
- **Database:** MongoDB (optional)  
- **Endpoints:**
  - `POST /api/v1/assessment` – submit an assessment
  - `GET /api/v1/recommendation/user/:userid` – get recommendations based on the latest assessment

### Frontend
- **Framework:** React + Vite  
- **Port:** 3000  
- **Components:**
  - `AssessmentForm.jsx` – assessment input form
  - `ResultDisplay.jsx` – displays results
  - `HomePage.jsx` – landing page
  - `AssessmentPage.jsx` – assessment page

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ for development

### 1. Extract and setup
```bash
# Extract the app
tar -xzf diet-app.tar.gz
cd diet-app

# Or run the setup script
chmod +x setup.sh
./setup.sh
```

Copy the example environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Run with Docker
```bash
# Start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### 3. Access the app
- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000

## 📡 API Endpoints

### Assessment Endpoint
```bash
POST /api/v1/assessment
Content-Type: application/json

{
  "age": 25,
  "weight": 70,
  "height": 170,
  "goal": "diet",
  "diseases": ["diabetes"]
}
```

### Goal Values
Use one of the following values for the `goal` field when calling `POST /api/v1/assessment`:

| String value   | Display label  |
|---------------|----------------|
| `hidup_sehat` | Healthy Life   |
| `diet`        | Diet           |
| `massa_otot`  | Build Muscle   |

The backend converts these strings to user-friendly labels in the response.

### Recommendation Endpoint
```bash
GET /api/v1/recommendation/user/:userid
```
Returns a `mealPlan`, `recommendations`, and `restrictions` from the user’s latest assessment.

## 🗂️ Project Structure
```
diet-app/
├── backend/                    # Main server files
│   ├── app.js                  # Backend entry point
│   ├── routes/
│   │   └── assessmentRoutes.js # API routes
│   ├── controllers/
│   └── ...
└── frontend/
    ├── src/
    │   └── ...
    └── ...
```

## 📦 Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                       │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   FRONTEND   │ │   BACKEND    │ │   MONGODB    │    │
│  │  React:3000  │ │ Express:5000 │ │    :27017    │    │
│  │              │ │              │ │              │    │
│  │   Vite +     │ │  Node.js +   │ │   Mongo 7.0  │    │
│  │   React      │ │  Express     │ │   + InitDB   │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│         │                 │                 │          │
│         └─────────────────┼─────────────────┘          │
│                           │                            │
│               ┌───────────▼──────────┐                 │
│               │    SHARED NETWORK    │                 │
│               │   diet-app-network   │                 │
│               └──────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Running Services

### MongoDB Container
- Port: 27017  
- Auto-initialized with sample data  
- Persistent volume for storage

### Backend Container
- Port: 5000  
- Express.js with all service orchestration  
- Built-in health checks

### Frontend Container
- Port: 3000  
- React + Vite  
- Ready for production build

## 🛠️ Management Commands
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

The app is ready to deploy using Docker Compose:

1. Clone this repository.  
2. Copy `.env.example` to `.env` for both backend and frontend:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Run `docker-compose up --build -d`.  
4. Access the app on the configured ports.

---

**🎯 Goal:** A simple diet assessment app that delivers personalized recommendations based on BMI, diet goals, and the user’s health conditions.

