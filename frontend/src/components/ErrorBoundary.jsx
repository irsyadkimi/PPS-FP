import React from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate a unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error');
      console.error('Error ID:', errorId);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo, errorId);
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // This is where you would integrate with error reporting services
    const errorData = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('dietapp_user_id') || 'anonymous'
    };

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorData });
      console.error('Error logged:', errorData);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorId } = this.state;
    const subject = `Error Report - ${errorId}`;
    const body = `
Error ID: ${errorId}
Error Message: ${error?.message || 'Unknown error'}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]
    `;
    
    const mailtoLink = `mailto:support@dietassessment.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-content">
              {/* Error Icon */}
              <div className="error-icon">
                <AlertTriangle size={64} />
              </div>

              {/* Error Message */}
              <div className="error-message">
                <h1 className="error-title">Oops! Something went wrong</h1>
                <p className="error-description">
                  Kami mengalami masalah teknis yang tidak terduga. Tim kami sudah diberitahu 
                  dan sedang mengatasi masalah ini.
                </p>
                
                {isDevelopment && error && (
                  <div className="error-details">
                    <h3>Error Details (Development Only):</h3>
                    <pre className="error-stack">
                      <strong>Error:</strong> {error.message}
                      {'\n\n'}
                      <strong>Stack:</strong>
                      {'\n'}
                      {error.stack}
                    </pre>
                  </div>
                )}

                <div className="error-id">
                  <span>Error ID: <code>{errorId}</code></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="error-actions">
                <button 
                  onClick={this.handleReload}
                  className="btn btn-primary"
                >
                  <RefreshCw size={18} />
                  Muat Ulang Halaman
                </button>
                
                <button 
                  onClick={this.handleGoHome}
                  className="btn btn-secondary"
                >
                  <Home size={18} />
                  Kembali ke Beranda
                </button>
                
                <button 
                  onClick={this.handleReportError}
                  className="btn btn-warning"
                >
                  <Mail size={18} />
                  Laporkan Error
                </button>
              </div>

              {/* Help Text */}
              <div className="error-help">
                <h3>Yang bisa Anda lakukan:</h3>
                <ul>
                  <li>Muat ulang halaman untuk mencoba lagi</li>
                  <li>Kembali ke halaman utama</li>
                  <li>Coba lagi beberapa saat kemudian</li>
                  <li>Laporkan error ini kepada kami</li>
                </ul>
                
                <p className="help-note">
                  Jika masalah berlanjut, silakan hubungi support kami di{' '}
                  <a href="mailto:support@dietassessment.com">
                    support@dietassessment.com
                  </a>
                </p>
              </div>

              {/* Additional Info */}
              <div className="error-info">
                <details className="error-details-toggle">
                  <summary>Technical Information</summary>
                  <div className="tech-info">
                    <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>URL:</strong> {window.location.href}</p>
                    <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                    {isDevelopment && (
                      <div className="component-stack">
                        <strong>Component Stack:</strong>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }

            .error-container {
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              width: 100%;
              overflow: hidden;
            }

            .error-content {
              padding: 40px;
              text-align: center;
            }

            .error-icon {
              color: #f56565;
              margin-bottom: 24px;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }

            .error-title {
              font-size: 28px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 16px;
            }

            .error-description {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.6;
              margin-bottom: 24px;
            }

            .error-details {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
              text-align: left;
            }

            .error-details h3 {
              font-size: 14px;
              font-weight: 600;
              color: #e53e3e;
              margin-bottom: 12px;
            }

            .error-stack {
              font-size: 12px;
              font-family: 'Monaco', 'Courier New', monospace;
              color: #2d3748;
              background: white;
              padding: 12px;
              border-radius: 4px;
              border: 1px solid #e2e8f0;
              max-height: 200px;
              overflow-y: auto;
              white-space: pre-wrap;
              word-break: break-all;
            }

            .error-id {
              background: #edf2f7;
              border-radius: 6px;
              padding: 8px 12px;
              margin: 16px 0;
              font-size: 14px;
              color: #4a5568;
            }

            .error-id code {
              background: #e2e8f0;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 12px;
            }

            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin: 32px 0;
              flex-wrap: wrap;
            }

            .btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 12px 20px;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              text-decoration: none;
            }

            .btn-primary {
              background: #667eea;
              color: white;
            }

            .btn-primary:hover {
              background: #5a67d8;
              transform: translateY(-1px);
            }

            .btn-secondary {
              background: #e2e8f0;
              color: #4a5568;
            }

            .btn-secondary:hover {
              background: #cbd5e0;
              transform: translateY(-1px);
            }

            .btn-warning {
              background: #ed8936;
              color: white;
            }

            .btn-warning:hover {
              background: #dd6b20;
              transform: translateY(-1px);
            }

            .error-help {
              text-align: left;
              background: #f0fff4;
              border: 1px solid #9ae6b4;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
            }

            .error-help h3 {
              font-size: 16px;
              font-weight: 600;
              color: #22543d;
              margin-bottom: 12px;
            }

            .error-help ul {
              margin-bottom: 16px;
              padding-left: 20px;
            }

            .error-help li {
              color: #2f855a;
              margin-bottom: 4px;
            }

            .help-note {
              font-size: 14px;
              color: #2f855a;
              margin: 0;
            }

            .help-note a {
              color: #2b6cb0;
              text-decoration: none;
            }

            .help-note a:hover {
              text-decoration: underline;
            }

            .error-info {
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              margin-top: 24px;
            }

            .error-details-toggle {
              text-align: left;
            }

            .error-details-toggle summary {
              cursor: pointer;
              font-weight: 600;
              color: #4a5568;
              font-size: 14px;
              padding: 8px 0;
            }

            .error-details-toggle summary:hover {
              color: #2d3748;
            }

            .tech-info {
              padding: 12px 0;
              font-size: 12px;
              color: #718096;
            }

            .tech-info p {
              margin: 4px 0;
              word-break: break-all;
            }

            .component-stack {
              margin-top: 12px;
            }

            .component-stack pre {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 8px;
              font-size: 10px;
              max-height: 100px;
              overflow-y: auto;
              white-space: pre-wrap;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
              .error-content {
                padding: 24px;
              }

              .error-title {
                font-size: 24px;
              }

              .error-actions {
                flex-direction: column;
                align-items: center;
              }

              .btn {
                width: 100%;
                max-width: 280px;
                justify-content: center;
              }
            }

            @media (max-width: 480px) {
              .error-boundary {
                padding: 12px;
              }

              .error-content {
                padding: 20px;
              }

              .error-title {
                font-size: 20px;
              }

              .error-description {
                font-size: 14px;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
