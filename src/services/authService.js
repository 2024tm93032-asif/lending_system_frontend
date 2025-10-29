import api, { MOCK_MODE } from './api';
import { mockUsers, delay } from './mockData';

export const authService = {
  login: async (credentials) => {
    if (MOCK_MODE) {
      await delay();
      
      // Check mock users
      const user = Object.values(mockUsers).find(u => 
        u.username === credentials.username
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // For demo purposes, accept any password for existing users
      // In real app: if (credentials.password !== 'correct_password')
      
      const token = 'mock_jwt_token_' + user.id;
      const response = { token, user };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response;
    }
    
    // Real API call
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    if (MOCK_MODE) {
      await delay();
      
      // Check if username already exists
      const existingUser = Object.values(mockUsers).find(u => 
        u.username === userData.username || u.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      
      // Create new mock user
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || 'student',
        created_at: new Date().toISOString()
      };
      
      const token = 'mock_jwt_token_' + newUser.id;
      const response = { token, user: newUser };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return response;
    }
    
    // Real API call
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    if (MOCK_MODE) {
      await delay();
      const user = authService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      return { user };
    }
    
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    if (MOCK_MODE) {
      await delay();
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');
      
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }
    
    const response = await api.put('/auth/profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};