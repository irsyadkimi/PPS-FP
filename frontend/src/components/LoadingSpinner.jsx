import React from 'react';

// Default loading spinner component
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  message = null 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          inline-block animate-spin rounded-full border-2 border-solid 
          border-current border-r-transparent align-[-0.125em] 
          motion-reduce:animate-[spin_1.5s_linear_infinite] 
          ${sizeClasses[size]} ${colorClasses[color]}
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {message && (
        <span className="ml-3 text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
};

// Page loader component for full page loading
export const PageLoader = ({ 
  message = 'Loading...', 
  submessage = null,
  size = 'xl',
  color = 'blue' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <div className="mb-6">
          <LoadingSpinner size={size} color={color} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {message}
        </h2>
        {submessage && (
          <p className="text-sm text-gray-600">{submessage}</p>
        )}
      </div>
    </div>
  );
};

// Card loader for loading content within cards
export const CardLoader = ({ 
  lines = 3, 
  className = '',
  showAvatar = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`h-4 bg-gray-300 rounded ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Button loader for loading states in buttons
export const ButtonLoader = ({ size = 'sm', color = 'white' }) => {
  return (
    <LoadingSpinner 
      size={size} 
      color={color} 
      className="inline-flex"
    />
  );
};

// Inline loader for inline loading states
export const InlineLoader = ({ 
  message = 'Loading...', 
  size = 'sm',
  color = 'blue' 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} color={color} />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

// Overlay loader for modal/overlay loading
export const OverlayLoader = ({ 
  message = 'Loading...', 
  isVisible = true,
  backgroundColor = 'bg-white bg-opacity-75'
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundColor}`}>
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
};

// Export default
export default LoadingSpinner;
