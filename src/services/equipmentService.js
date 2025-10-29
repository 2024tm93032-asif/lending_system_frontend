import api, { MOCK_MODE } from './api';
import { mockEquipment, mockCategories, delay } from './mockData';

export const equipmentService = {
  getAll: async (filters = {}) => {
    if (MOCK_MODE) {
      await delay();
      
      let filteredEquipment = [...mockEquipment];
      
      // Apply filters
      if (filters.category) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      if (filters.condition) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.condition === filters.condition
        );
      }
      
      if (filters.available_only === 'true' || filters.available_only === true) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.available_quantity > 0
        );
      }
      
      if (filters.search) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      return { equipment: filteredEquipment };
    }
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/equipment?${params}`);
    return response.data;
  },

  getById: async (id) => {
    if (MOCK_MODE) {
      await delay();
      const equipment = mockEquipment.find(item => item.id === parseInt(id));
      if (!equipment) throw new Error('Equipment not found');
      return { equipment };
    }
    
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  getCategories: async () => {
    if (MOCK_MODE) {
      await delay();
      return { categories: mockCategories };
    }
    
    const response = await api.get('/equipment/categories');
    return response.data;
  },

  create: async (equipmentData) => {
    const response = await api.post('/equipment', equipmentData);
    return response.data;
  },

  update: async (id, equipmentData) => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  }
};