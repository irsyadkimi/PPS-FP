import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          {/* Catch all route untuk debugging */}
          <Route path="*" element={
            <div style={{padding: '2rem', textAlign: 'center'}}>
              <h2>404 - Page Not Found</h2>
              <p>Current path: {window.location.pathname}</p>
              <a href="/">Go to Homepage</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
