import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    return userData;
  },
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    return userData;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const itemService = {
  getFoundItems: async () => {
    const response = await api.get('/items/found');
    return response.data;
  },
  addFoundItem: async (data: any) => {
    const response = await api.post('/items/add-found', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getQuestions: async (itemId: string) => {
    const response = await api.get(`/items/${itemId}/questions`);
    return response.data;
  },
  getVerificationQuestions: async (itemId: string) => {
    const response = await api.get(`/items/${itemId}/questions`);
    return response.data;
  },
};

export const claimService = {
  getClaims: async () => {
    const response = await api.get('/claims');
    return response.data;
  },
  submitAnswers: async (itemId: string, answers: Record<string, string>) => {
    const response = await api.post('/claims/submit-answers', { itemId, answers });
    return response.data;
  },
  generateOTP: async (claimId: string, phone: string) => {
    const response = await api.post('/claims/generate-otp', { claimId, phone });
    return response.data;
  },
  verifyOTP: async (claimId: string, otp: string, phone: string) => {
    const response = await api.post('/claims/verify-otp', { claimId, otp, phone });
    return response.data;
  },
  verifyQR: async (claimId: string, qrData: string) => {
    const response = await api.post('/claims/verify-qr', { claimId, qrData });
    return response.data;
  },
  approveClaim: async (claimId: string) => {
    const response = await api.post('/claims/approve', { claimId });
    return response.data;
  },
  rejectClaim: async (claimId: string) => {
    const response = await api.post('/claims/reject', { claimId });
    return response.data;
  },
};