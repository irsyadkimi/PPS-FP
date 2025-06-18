// API services untuk komunikasi dengan backend
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function untuk handle API response
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Submit assessment data ke backend
export const submitAssessment = async (assessmentData) => {
  try {
    console.log('Sending assessment data:', assessmentData);
    
    const response = await fetch(`${API_BASE_URL}/assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    });

    const result = await handleApiResponse(response);
    console.log('Assessment result:', result);
    
    return result;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw new Error(`Gagal mengirim asesmen: ${error.message}`);
  }
};

// Get recommendation berdasarkan user ID
export const getRecommendation = async (userId) => {
  try {
    console.log('Getting recommendation for user:', userId);
    
    const response = await fetch(`${API_BASE_URL}/recommendation/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleApiResponse(response);
    console.log('Recommendation result:', result);
    
    return result;
  } catch (error) {
    console.error('Error getting recommendation:', error);
    throw new Error(`Gagal mengambil rekomendasi: ${error.message}`);
  }
};

// Get assessment history berdasarkan user ID
export const getAssessmentHistory = async (userId) => {
  try {
    console.log('Getting assessment history for user:', userId);
    
    const response = await fetch(`${API_BASE_URL}/assessment/history/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleApiResponse(response);
    console.log('Assessment history:', result);
    
    return result;
  } catch (error) {
    console.error('Error getting assessment history:', error);
    throw new Error(`Gagal mengambil riwayat asesmen: ${error.message}`);
  }
};

// Health check backend
export const healthCheck = async () => {
  try {
    const response = await fetch(`http://localhost:5000/health`, {
      method: 'GET',
    });

    const result = await handleApiResponse(response);
    console.log('Health check result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in health check:', error);
    throw new Error(`Backend tidak dapat diakses: ${error.message}`);
  }
};
