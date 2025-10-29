import React, { useState, useEffect } from 'react';
import { borrowService } from '../services/borrowService';
import './BorrowRequests.css';

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { status: filter } : {};
      const data = await borrowService.getAll(filters);
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'borrowed': return 'primary';
      case 'returned': return 'secondary';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="container">
      <div className="borrow-requests-page">
        <h1>My Borrow Requests</h1>
        
        <div className="filters-section">
          <div className="status-filters">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`btn ${filter === 'borrowed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('borrowed')}
            >
              Borrowed
            </button>
            <button
              className={`btn ${filter === 'returned' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('returned')}
            >
              Returned
            </button>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="requests-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Request Date</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="equipment-info">
                        <strong>{request.equipment_name}</strong>
                        <br />
                        <small>{request.equipment_category}</small>
                      </div>
                    </td>
                    <td>{request.quantity_requested}</td>
                    <td>{formatDate(request.request_date)}</td>
                    <td>{formatDate(request.start_date)}</td>
                    <td>{formatDate(request.end_date)}</td>
                    <td>
                      <span className={`badge badge-${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="notes-cell">
                        {request.notes && (
                          <div className="user-notes">
                            <strong>Request:</strong> {request.notes}
                          </div>
                        )}
                        {request.admin_notes && (
                          <div className="admin-notes">
                            <strong>Admin:</strong> {request.admin_notes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-requests">
            <p>No borrow requests found.</p>
            <a href="/equipment" className="btn btn-primary">
              Browse Equipment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowRequests;