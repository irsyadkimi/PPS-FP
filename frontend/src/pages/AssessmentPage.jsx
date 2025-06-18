import React, { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import ResultDisplay from '../components/ResultDisplay';
import './AssessmentPage.css';

const AssessmentPage = () => {
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
  };

  const handleStartOver = () => {
    setAssessmentResult(null);
  };

  return (
    <div className="assessment-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="#" className="nav-link">About</a>
          <div className="nav-dropdown">
            <a href="#" className="nav-link">Resources ⌄</a>
          </div>
          <a href="#" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {!assessmentResult ? (
          <>
            {/* Welcome Header */}
            <div className="welcome-header">
              <h1 className="page-title">Selamat Datang</h1>
              <h2 className="page-subtitle">Di Asesmen Diet</h2>
              <p className="page-description">
                Kami akan membantu anda menentukan program yang sesuai bagi 
                anda, isi semua pertanyaan dengan sebenar-benarnya untuk 
                keakuratan program. sudah siap melakukan test??
              </p>
            </div>

            {/* Assessment Form */}
            <AssessmentForm 
              onComplete={handleAssessmentComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </>
        ) : (
          <ResultDisplay 
            result={assessmentResult}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Red frame decoration */}
      <div className="red-frame"></div>
    </div>
  );
};

export default AssessmentPage;
