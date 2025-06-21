// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API utility functions
export const apiUtils = {
  formatResponse: (data) => data,
  handleError: (error) => {
    console.error('API Error:', error);
    if (error.response) {
      return {
        error: true,
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status
      };
    }
    return {
      error: true,
      message: error.message || 'Network error occurred',
      status: 0
    };
  },
  validateResponse: (response) => {
    return response && response.data;
  },
  createHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

// Assessment API functions
export const assessmentAPI = {
  // Submit assessment
  submitAssessment: async (assessmentData) => {
    try {
      console.log('📤 Submitting assessment to:', `${API_BASE_URL}/api/v1/assessment`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment`, {
        method: 'POST',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(assessmentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Assessment submission failed');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get assessment by ID - NEW FUNCTION
  getAssessmentById: async (assessmentId) => {
    try {
      console.log('📥 Fetching assessment:', assessmentId);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/${assessmentId}`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get assessment');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get assessment form structure
  getAssessmentForm: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/form`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get form structure');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Validate assessment data
  validateAssessmentData: async (assessmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/validate`, {
        method: 'POST',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(assessmentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Validation failed');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get recommendations
  getRecommendations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/recommendation/${userId}`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get recommendations');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get assessment history
  getAssessmentHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/history/${userId}`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get assessment history');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences/${userId}`, {
        method: 'PUT',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  }
};

// Health check function
export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Health check failed');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  }
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
        method: 'PUT',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get preferences');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
        method: 'PUT',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get user dashboard
  getDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/dashboard`, {
        method: 'GET',
        headers: apiUtils.createHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get dashboard');
      }
      
      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  }
};

// Default export
export default assessmentAPI;