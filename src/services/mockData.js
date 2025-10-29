// Mock data for testing without backend
export const mockUsers = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@school.edu',
    fullName: 'System Administrator',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  student: {
    id: 2,
    username: 'student',
    email: 'student@school.edu',
    fullName: 'John Student',
    role: 'student',
    created_at: '2024-01-15T00:00:00Z'
  },
  staff: {
    id: 3,
    username: 'staff',
    email: 'staff@school.edu',
    fullName: 'Jane Staff',
    role: 'staff',
    created_at: '2024-01-10T00:00:00Z'
  }
};

export const mockEquipment = [
  {
    id: 1,
    name: 'Canon DSLR Camera',
    category: 'Camera',
    description: 'Professional DSLR camera for photography projects',
    condition: 'excellent',
    total_quantity: 5,
    available_quantity: 3,
    created_by: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Lab Microscope',
    category: 'Lab Equipment',
    description: 'High-power microscope for biology experiments',
    condition: 'good',
    total_quantity: 10,
    available_quantity: 7,
    created_by: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Wireless Microphone',
    category: 'Audio Equipment',
    description: 'Professional wireless microphone for presentations',
    condition: 'excellent',
    total_quantity: 3,
    available_quantity: 2,
    created_by: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Graphics Tablet',
    category: 'Computer Equipment',
    description: 'Digital drawing tablet for design projects',
    condition: 'good',
    total_quantity: 8,
    available_quantity: 5,
    created_by: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Soccer Ball Set',
    category: 'Sports Equipment',
    description: 'Professional soccer balls for sports activities',
    condition: 'fair',
    total_quantity: 20,
    available_quantity: 15,
    created_by: 1,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockBorrowRequests = [
  {
    id: 1,
    user_id: 2,
    user_name: 'John Student',
    user_role: 'student',
    equipment_id: 1,
    equipment_name: 'Canon DSLR Camera',
    equipment_category: 'Camera',
    quantity_requested: 1,
    request_date: '2024-01-20T00:00:00Z',
    start_date: '2024-01-25T00:00:00Z',
    end_date: '2024-01-30T00:00:00Z',
    status: 'pending',
    notes: 'Need for photography assignment',
    admin_notes: null,
    approved_by: null,
    approved_at: null,
    borrowed_at: null,
    returned_at: null
  },
  {
    id: 2,
    user_id: 2,
    user_name: 'John Student',
    user_role: 'student',
    equipment_id: 4,
    equipment_name: 'Graphics Tablet',
    equipment_category: 'Computer Equipment',
    quantity_requested: 1,
    request_date: '2024-01-18T00:00:00Z',
    start_date: '2024-01-22T00:00:00Z',
    end_date: '2024-01-26T00:00:00Z',
    status: 'approved',
    notes: 'Digital art project',
    admin_notes: 'Approved for art class',
    approved_by: 1,
    approved_at: '2024-01-19T00:00:00Z',
    borrowed_at: null,
    returned_at: null
  }
];

export const mockStats = {
  totalEquipment: 5,
  availableEquipment: 32,
  totalUsers: 25,
  pendingRequests: 3,
  activeBorrows: 8,
  overdueReturns: 1,
  userActiveRequests: 1,
  userBorrowedItems: 2
};

export const mockCategories = ['Camera', 'Lab Equipment', 'Audio Equipment', 'Computer Equipment', 'Sports Equipment'];

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));