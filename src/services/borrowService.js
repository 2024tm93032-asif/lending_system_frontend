import api, { MOCK_MODE } from './api';
import { mockBorrowRequests, mockStats, delay } from './mockData';

export const borrowService = {
  getAll: async (filters = {}) => {
    if (MOCK_MODE) {
      await delay();
      
      let filteredRequests = [...mockBorrowRequests];
      
      // Apply filters
      if (filters.status) {
        filteredRequests = filteredRequests.filter(req => req.status === filters.status);
      }
      
      if (filters.limit) {
        filteredRequests = filteredRequests.slice(0, parseInt(filters.limit));
      }
      
      return { requests: filteredRequests };
    }
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/borrow?${params}`);
    return response.data;
  },

  getById: async (id) => {
    if (MOCK_MODE) {
      await delay();
      const request = mockBorrowRequests.find(req => req.id === parseInt(id));
      if (!request) throw new Error('Request not found');
      return { request };
    }
    
    const response = await api.get(`/borrow/${id}`);
    return response.data;
  },

  create: async (borrowData) => {
    if (MOCK_MODE) {
      await delay();
      
      const newRequest = {
        id: Date.now(),
        user_id: 2, // Current user
        user_name: 'Current User',
        user_role: 'student',
        equipment_id: borrowData.equipmentId,
        equipment_name: 'Equipment Name',
        equipment_category: 'Category',
        quantity_requested: borrowData.quantityRequested,
        request_date: new Date().toISOString(),
        start_date: borrowData.startDate,
        end_date: borrowData.endDate,
        status: 'pending',
        notes: borrowData.notes,
        admin_notes: null,
        approved_by: null,
        approved_at: null,
        borrowed_at: null,
        returned_at: null
      };
      
      // Add to mock data (in real app this would be persisted)
      mockBorrowRequests.unshift(newRequest);
      
      return { request: newRequest };
    }
    
    const response = await api.post('/borrow', borrowData);
    return response.data;
  },

  approveReject: async (id, data) => {
    if (MOCK_MODE) {
      await delay();
      
      const requestIndex = mockBorrowRequests.findIndex(req => req.id === parseInt(id));
      if (requestIndex === -1) throw new Error('Request not found');
      
      mockBorrowRequests[requestIndex] = {
        ...mockBorrowRequests[requestIndex],
        status: data.status,
        admin_notes: data.notes,
        approved_by: 1,
        approved_at: new Date().toISOString()
      };
      
      return { request: mockBorrowRequests[requestIndex] };
    }
    
    const response = await api.put(`/borrow/${id}/approve-reject`, data);
    return response.data;
  },

  markBorrowed: async (id) => {
    if (MOCK_MODE) {
      await delay();
      
      const requestIndex = mockBorrowRequests.findIndex(req => req.id === parseInt(id));
      if (requestIndex === -1) throw new Error('Request not found');
      
      mockBorrowRequests[requestIndex] = {
        ...mockBorrowRequests[requestIndex],
        status: 'borrowed',
        borrowed_at: new Date().toISOString()
      };
      
      return { request: mockBorrowRequests[requestIndex] };
    }
    
    const response = await api.put(`/borrow/${id}/mark-borrowed`);
    return response.data;
  },

  markReturned: async (id) => {
    if (MOCK_MODE) {
      await delay();
      
      const requestIndex = mockBorrowRequests.findIndex(req => req.id === parseInt(id));
      if (requestIndex === -1) throw new Error('Request not found');
      
      mockBorrowRequests[requestIndex] = {
        ...mockBorrowRequests[requestIndex],
        status: 'returned',
        returned_at: new Date().toISOString()
      };
      
      return { request: mockBorrowRequests[requestIndex] };
    }
    
    const response = await api.put(`/borrow/${id}/mark-returned`);
    return response.data;
  },

  getStats: async () => {
    if (MOCK_MODE) {
      await delay();
      return mockStats;
    }
    
    const response = await api.get('/borrow/stats');
    return response.data;
  }
};