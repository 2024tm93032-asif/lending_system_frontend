import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowService } from '../services/borrowService';
import { equipmentService } from '../services/equipmentService';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'requests') {
        const data = await borrowService.getAll();
        setRequests(data.requests || []);
      } else if (activeTab === 'equipment') {
        const data = await equipmentService.getAll();
        setEquipment(data.equipment || []);
      } else if (activeTab === 'stats') {
        const data = await borrowService.getStats();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action, notes = '') => {
    try {
      if (action === 'approve' || action === 'reject') {
        await borrowService.approveReject(requestId, { 
          status: action === 'approve' ? 'approved' : 'rejected',
          notes 
        });
      } else if (action === 'borrowed') {
        await borrowService.markBorrowed(requestId);
      } else if (action === 'returned') {
        await borrowService.markReturned(requestId);
      }
      
      // Refresh requests
      fetchData();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
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

  if (user?.role !== 'admin' && user?.role !== 'staff') {
    return (
      <div className="container">
        <div className="alert alert-danger">
          Access denied. Admin or staff privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-panel">
        <h1>Admin Panel</h1>
        
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Borrow Requests
          </button>
          <button
            className={`tab ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Equipment Management
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeTab === 'requests' && (
                <RequestsTab 
                  requests={requests} 
                  onAction={handleRequestAction}
                  getStatusColor={getStatusColor}
                />
              )}
              
              {activeTab === 'equipment' && (
                <EquipmentTab equipment={equipment} onRefresh={fetchData} />
              )}
              
              {activeTab === 'stats' && <StatsTab stats={stats} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestsTab = ({ requests, onAction, getStatusColor }) => {
  const [actionNotes, setActionNotes] = useState({});

  const handleNotesChange = (requestId, notes) => {
    setActionNotes({ ...actionNotes, [requestId]: notes });
  };

  return (
    <div className="requests-tab">
      <h2>Manage Borrow Requests</h2>
      
      {requests.length > 0 ? (
        <div className="requests-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Equipment</th>
                <th>Quantity</th>
                <th>Period</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div>
                      <strong>{request.user_name}</strong>
                      <br />
                      <small>{request.user_role}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{request.equipment_name}</strong>
                      <br />
                      <small>{request.equipment_category}</small>
                    </div>
                  </td>
                  <td>{request.quantity_requested}</td>
                  <td>
                    <div>
                      {new Date(request.start_date).toLocaleDateString()}
                      <br />
                      to {new Date(request.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="notes-column">
                      {request.notes && (
                        <div className="user-notes">
                          <strong>User:</strong> {request.notes}
                        </div>
                      )}
                      {request.status === 'pending' && (
                        <textarea
                          placeholder="Admin notes..."
                          value={actionNotes[request.id] || ''}
                          onChange={(e) => handleNotesChange(request.id, e.target.value)}
                          className="admin-notes-input"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onAction(request.id, 'approve', actionNotes[request.id])}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onAction(request.id, 'reject', actionNotes[request.id])}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {request.status === 'approved' && (
                        <button
                          onClick={() => onAction(request.id, 'borrowed')}
                          className="btn btn-primary btn-sm"
                        >
                          Mark Borrowed
                        </button>
                      )}
                      
                      {request.status === 'borrowed' && (
                        <button
                          onClick={() => onAction(request.id, 'returned')}
                          className="btn btn-secondary btn-sm"
                        >
                          Mark Returned
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No borrow requests found.</p>
      )}
    </div>
  );
};

const EquipmentTab = ({ equipment, onRefresh }) => {
  return (
    <div className="equipment-tab">
      <h2>Equipment Management</h2>
      <p>Equipment management features would be implemented here.</p>
      <p>Current equipment count: {equipment.length}</p>
      
      <div className="equipment-summary">
        <div className="summary-grid">
          {equipment.slice(0, 10).map((item) => (
            <div key={item.id} className="equipment-summary-card">
              <h4>{item.name}</h4>
              <p>Available: {item.available_quantity}/{item.total_quantity}</p>
              <p>Condition: {item.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsTab = ({ stats }) => {
  if (!stats) {
    return <div>No statistics available.</div>;
  }

  return (
    <div className="stats-tab">
      <h2>System Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Equipment</h3>
          <div className="stat-number">{stats.totalEquipment || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Available Equipment</h3>
          <div className="stat-number">{stats.availableEquipment || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <div className="stat-number">{stats.pendingRequests || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Borrows</h3>
          <div className="stat-number">{stats.activeBorrows || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Overdue Returns</h3>
          <div className="stat-number">{stats.overdueReturns || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;