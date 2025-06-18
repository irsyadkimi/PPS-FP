import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Error boundary for production
if (import.meta.env.PROD) {
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  window.addEventListener('error', event => {
    console.error('Global error:', event.error);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)