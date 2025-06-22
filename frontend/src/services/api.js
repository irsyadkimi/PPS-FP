// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://217.15.160.69:5000';

// API utility functions
export const apiUtils = {
  formatResponse: (data) => data,
  getUserId: () => {
    let userId = localStorage.getItem('dietapp_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('dietapp_user_id', userId);
    }
    return userId;
  },
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
  }),
  setUserId: (id) => {
    if (id) {
      try {
        localStorage.setItem('dietapp_user_id', id);
      } catch (e) {
        console.warn('Unable to store userId:', e);
      }
    }
  }
};

// Assessment API functions
export const assessmentAPI = {
  // Submit assessment
  submitAssessment: async (assessmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment`, {
        method: 'POST',
        headers: apiUtils.createHeaders(),
        body: JSON.stringify(assessmentData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Assessment submission failed');
      }

      if (data.userId) {
        apiUtils.setUserId(data.userId);
      }

      return data;
    } catch (error) {
      return apiUtils.handleError(error);
    }
  },

  // Get recommendations for a specific user
  getRecommendations: async (userId) => {
    try {
      const id = userId || apiUtils.getUserId();
      const endpoint = `${API_BASE_URL}/api/v1/recommendation/user/${id}`;
      const response = await fetch(endpoint, {
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

  // Get generic meal recommendations
  getMealRecommendations: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const endpoint = `${API_BASE_URL}/api/v1/recommendation${searchParams ? `?${searchParams}` : ''}`;
      const response = await fetch(endpoint, {
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
      const id = userId || apiUtils.getUserId();
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/history/${id}`, {
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

  // Get assessment by ID
  getAssessmentById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/${id}`, {
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

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    try {
      const id = userId || apiUtils.getUserId();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences/${id}`, {
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

  // Alias for backwards compatibility
  getHistory: async (userId) => {
    return assessmentAPI.getAssessmentHistory(userId);
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

// Default export
export default assessmentAPI;