import React, { useState, useEffect } from 'react';
import { equipmentService } from '../services/equipmentService';
import { borrowService } from '../services/borrowService';
import BorrowModal from '../components/BorrowModal';
import './Equipment.css';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    available_only: true,
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll(filters);
      setEquipment(data.equipment || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await equipmentService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBorrowClick = (item) => {
    setSelectedEquipment(item);
    setShowBorrowModal(true);
  };

  const handleBorrowSubmit = async (borrowData) => {
    try {
      await borrowService.create({
        ...borrowData,
        equipmentId: selectedEquipment.id
      });
      setShowBorrowModal(false);
      setSelectedEquipment(null);
      // Refresh equipment list to update availability
      fetchEquipment();
    } catch (error) {
      console.error('Error creating borrow request:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="container">
      <div className="equipment-page">
        <h1>Available Equipment</h1>
        
        <div className="filters-section">
          <div className="filters">
            <div className="form-group">
              <input
                type="text"
                name="search"
                placeholder="Search equipment..."
                value={filters.search}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="available_only"
                  checked={filters.available_only}
                  onChange={handleFilterChange}
                />
                Available only
              </label>
            </div>
          </div>
        </div>

        <div className="equipment-grid">
          {equipment.length > 0 ? (
            equipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className="equipment-header">
                  <h3>{item.name}</h3>
                  <span className={`badge badge-${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
                
                <div className="equipment-details">
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Available:</strong> {item.available_quantity} / {item.total_quantity}</p>
                </div>
                
                <div className="equipment-actions">
                  {item.available_quantity > 0 ? (
                    <button
                      onClick={() => handleBorrowClick(item)}
                      className="btn btn-primary"
                    >
                      Request to Borrow
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-equipment">
              <p>No equipment found matching your filters.</p>
            </div>
          )}
        </div>

        {showBorrowModal && (
          <BorrowModal
            equipment={selectedEquipment}
            onSubmit={handleBorrowSubmit}
            onClose={() => {
              setShowBorrowModal(false);
              setSelectedEquipment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

const getConditionColor = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'excellent': return 'success';
    case 'good': return 'primary';
    case 'fair': return 'warning';
    case 'poor': return 'danger';
    default: return 'secondary';
  }
};

export default Equipment;