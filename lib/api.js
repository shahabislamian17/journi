// API utility functions for Next.js frontend

// Get API URL dynamically based on context
const getApiUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  // In server-side rendering, replace localhost with 127.0.0.1
  if (typeof window === 'undefined') {
    return configuredUrl.replace('localhost', '127.0.0.1');
  }
  return configuredUrl;
};

// Helper function to handle API requests
async function apiRequest(endpoint, options = {}) {
  const API_URL = getApiUrl(); // Get URL dynamically for each request
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage (client-side) or from options (server-side)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  } else if (options.token) {
    token = options.token;
    delete options.token; // Remove token from options
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    // Add timeout and better error handling (only if AbortController is available)
    let timeoutId;
    let controller;
    const fetchConfig = { ...config };
    
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for server-side
      fetchConfig.signal = controller.signal;
    }

    let response;
    try {
      response = await fetch(url, fetchConfig);
    } catch (fetchError) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Handle network errors (ECONNREFUSED, etc.)
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message.includes('fetch')) {
        const apiUrl = getApiUrl();
        console.error('Network connection error:', fetchError.message);
        console.error('Attempted URL:', url);
        console.error('Backend should be running on:', apiUrl);
        throw new Error(`Failed to connect to API server at ${apiUrl}. Please ensure the backend is running on port 4000.`);
      }
      throw fetchError;
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    // If response is empty, return empty object or throw error
    if (!text || text.trim() === '') {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return {};
    }
    
    // Parse JSON only if content-type indicates JSON
    let data;
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text.substring(0, 200));
        throw new Error('Invalid JSON response from API');
      }
    } else {
      // If not JSON, return text or throw error
      if (!response.ok) {
        throw new Error(`API request failed: ${text.substring(0, 200)}`);
      }
      return { data: text };
    }

    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data?.error || data?.message || `API request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle different types of errors
    if (error.name === 'AbortError') {
      console.error('API request timeout:', url);
      throw new Error('API request timed out. Please check if the backend server is running.');
    } else if (error.message.includes('fetch')) {
      console.error('Network error - Failed to fetch:', url);
      const apiUrl = getApiUrl();
      console.error('Make sure the backend server is running on', apiUrl);
      throw new Error(`Failed to connect to API server at ${apiUrl}. Please ensure the backend is running.`);
    } else {
      console.error('API request error:', error.message, 'URL:', url);
      throw error;
    }
  }
}

// Auth API
export const authAPI = {
  register: (data) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMe: (options = {}) => apiRequest('/api/auth/me', options),

  updateProfile: (data) => apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  changePassword: (data) => apiRequest('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  forgotPassword: (email) => apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (data) => apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/api/categories'),
  getBySlug: (slug) => apiRequest(`/api/categories/${slug}`),
};

// Experiences API
export const experiencesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/experiences${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id, options = {}) => apiRequest(`/api/experiences/by-id/${id}`, options),
  getBySlug: (slug, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/experiences/${slug}${queryString ? `?${queryString}` : ''}`);
  },
  create: (data, options = {}) => apiRequest('/api/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  update: (id, data, options = {}) => apiRequest(`/api/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
};

// Bookings API
export const bookingsAPI = {
  getAll: (options = {}) => apiRequest('/api/bookings', options),
  getById: (id, options = {}) => apiRequest(`/api/bookings/${id}`, options),
  create: (data, options = {}) => apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  updateStatus: (id, data, options = {}) => apiRequest(`/api/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
  cancel: (id, options = {}) => apiRequest(`/api/bookings/${id}/cancel`, {
    method: 'POST',
    ...options,
  }),
};

// Wishlist API
export const wishlistAPI = {
  getAll: (options = {}) => apiRequest('/api/wishlist', options),
  add: (experienceId, options = {}) => {
    // Validate experienceId before making the request
    if (!experienceId || experienceId === null || experienceId === undefined || experienceId === '') {
      throw new Error('Experience ID is required');
    }
    
    // Always convert to string - database expects String/UUID
    // This ensures consistency regardless of input type (number or string)
    const validExpId = String(experienceId).trim();
    
    if (!validExpId || validExpId === '') {
      throw new Error('Invalid experience ID format');
    }
    
    console.log('wishlistAPI.add called with:', { experienceId, validExpId, originalType: typeof experienceId });
    
    return apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ experienceId: validExpId }),
      ...options,
    });
  },
  remove: (experienceId, options = {}) => {
    // Validate experienceId before making the request
    if (!experienceId || experienceId === null || experienceId === undefined || experienceId === '') {
      throw new Error('Experience ID is required');
    }
    
    // Always convert to string - database expects String/UUID
    // This ensures consistency regardless of input type (number or string)
    const validExpId = String(experienceId).trim();
    
    if (!validExpId || validExpId === '') {
      throw new Error('Invalid experience ID format');
    }
    
    return apiRequest(`/api/wishlist/${validExpId}`, {
      method: 'DELETE',
      ...options,
    });
  },
};

// Reviews API
export const reviewsAPI = {
  getWebsiteFeatured: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/reviews/website/featured${queryString ? `?${queryString}` : ''}`);
  },
  getByExperience: (experienceId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/reviews/experience/${experienceId}${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/api/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// Messages API
export const messagesAPI = {
  getAll: () => apiRequest('/api/messages'),
  getById: (id) => apiRequest(`/api/messages/${id}`),
  create: (data) => apiRequest('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  markAsRead: (id) => apiRequest(`/api/messages/${id}/read`, {
    method: 'PUT',
  }),
  delete: (id) => apiRequest(`/api/messages/${id}`, {
    method: 'DELETE',
  }),
};

// Stays API
export const staysAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/stays${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/api/stays/${id}`),
};

// Cars API
export const carsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/cars${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/api/cars/${id}`),
};

export default {
  auth: authAPI,
  categories: categoriesAPI,
  experiences: experiencesAPI,
  bookings: bookingsAPI,
  wishlist: wishlistAPI,
  reviews: reviewsAPI,
  messages: messagesAPI,
  stays: staysAPI,
  cars: carsAPI,
};

