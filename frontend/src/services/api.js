import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (!response) {
      console.error('Network Error:', error);
      throw new Error('Network error. Please check your internet connection.');
    }
    
    const { status, data } = response;
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request');
      case 401:
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/admin';
        throw new Error('Session expired. Please login again.');
      case 403:
        throw new Error('Access forbidden');
      case 404:
        throw new Error('Resource not found');
      case 422:
        // Validation errors
        const validationErrors = data.errors || [];
        throw new Error(validationErrors.map(err => err.message).join(', '));
      case 500:
        throw new Error(data.message || 'Internal server error');
      default:
        throw new Error(data.message || 'An error occurred');
    }
  }
);

// Booking API
export const bookingApi = {
  // Create new booking
 createBooking: async (bookingData) => {
    try {
      console.log('📨 Calling /api/bookings with:', bookingData)
      const response = await api.post('/api/bookings', bookingData)
      console.log('📩 Response received:', response)
      return response
    } catch (error) {
      console.error('🔥 API Error:', error)
      throw error
    }
  },
  // Get all bookings (admin only)
  getAllBookings: async (params = {}) => {
    return await api.get('/api/bookings', { params });
  },

  // Get booking by ID
  getBooking: async (id) => {
    return await api.get(`/api/bookings/${id}`);
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    return await api.put(`/api/bookings/${id}/status`, { status });
  },

  // Delete booking
  deleteBooking: async (id) => {
    return await api.delete(`/api/bookings/${id}`);
  },

  // Get booking statistics
  getBookingStats: async () => {
    return await api.get('/api/bookings/stats');
  },
};

// Contact API
export const contactApi = {
  // Create new contact inquiry
  createContact: async (contactData) => {
    try {
      console.log('📨 Calling /api/contact with:', contactData)
      const response = await api.post('/api/contact', contactData)
      console.log('📩 Contact Response:', response)
      return response
    } catch (error) {
      console.error('🔥 Contact API Error:', error)
      throw error
    }
  },

  // Get all contacts (admin only)
  getAllContacts: async (params = {}) => {
    return await api.get('/api/contact', { params });
  },

  // Get contact by ID
  getContact: async (id) => {
    return await api.get(`/api/contact/${id}`);
  },

  // Update contact status
  updateContactStatus: async (id, status) => {
    return await api.put(`/api/contact/${id}/status`, { status });
  },

  // Delete contact
  deleteContact: async (id) => {
    return await api.delete(`/api/contact/${id}`);
  },

  // Get contact statistics
  getContactStats: async () => {
    return await api.get('/api/contact/stats');
  },
};

// Gallery API
export const galleryApi = {
  // Upload image
  uploadImage: async (formData) => {
    return await api.post('/api/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all gallery images
  getAllImages: async (params = {}) => {
    return await api.get('/api/gallery', { params });
  },

  // Get featured images
  getFeaturedImages: async () => {
    return await api.get('/api/gallery/featured');
  },

  // Get gallery categories
  getCategories: async () => {
    return await api.get('/api/gallery/categories');
  },

  // Get image by ID
  getImage: async (id) => {
    return await api.get(`/api/gallery/${id}`);
  },

  // Update image
  updateImage: async (id, data) => {
    return await api.put(`/api/gallery/${id}`, data);
  },

  // Delete image
  deleteImage: async (id) => {
    return await api.delete(`/api/gallery/${id}`);
  },
};

// Auth API (for future use)
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  userLogin: async (credentials) => {
    const response = await api.post('/api/auth/user-login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  adminRegister: async (userData) => {
    const response = await api.post('/api/auth/admin-register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  },

  getCurrentUser: async () => {
    return await api.get('/api/auth/me');
  },

  getUserRole: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr).role;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.status === 'OK';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default {
  bookingApi,
  contactApi,
  galleryApi,
  authApi,
  checkHealth,
};