import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import pages
import HomePage from '@/pages/HomePage';
import AssessmentPage from '@/pages/AssessmentPage';
import ResultsPage from '@/pages/ResultsPage';
import HistoryPage from '@/pages/HistoryPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Import components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import styles
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Assessment Flow */}
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/results/:assessmentId" element={<ResultsPage />} />
              
              {/* User History */}
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:userId" element={<HistoryPage />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;