import React, { useState } from 'react';
import './BorrowModal.css';

const BorrowModal = ({ equipment, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    quantityRequested: 1,
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.quantityRequested > equipment.available_quantity) {
      setError(`Only ${equipment.available_quantity} items available`);
      return;
    }

    if (new Date(formData.startDate) < new Date()) {
      setError('Start date cannot be in the past');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create borrow request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request to Borrow</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="equipment-info">
            <h3>{equipment.name}</h3>
            <p><strong>Category:</strong> {equipment.category}</p>
            <p><strong>Available:</strong> {equipment.available_quantity} / {equipment.total_quantity}</p>
            <p><strong>Condition:</strong> {equipment.condition}</p>
            {equipment.description && (
              <p><strong>Description:</strong> {equipment.description}</p>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Quantity Requested</label>
              <input
                type="number"
                name="quantityRequested"
                value={formData.quantityRequested}
                onChange={handleChange}
                min="1"
                max={equipment.available_quantity}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Purpose of borrowing, special requirements, etc."
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;