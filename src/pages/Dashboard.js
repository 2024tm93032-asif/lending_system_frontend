import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowService } from '../services/borrowService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([
          borrowService.getStats(),
          borrowService.getAll({ limit: 5 })
        ]);
        
        setStats(statsData);
        setRecentRequests(requestsData.requests || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome back, {user.fullName}!</h1>
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Equipment</h3>
              <div className="stat-number">{stats.totalEquipment || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Available Items</h3>
              <div className="stat-number">{stats.availableEquipment || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>My Active Requests</h3>
              <div className="stat-number">{stats.userActiveRequests || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Items Borrowed</h3>
              <div className="stat-number">{stats.userBorrowedItems || 0}</div>
            </div>
          </div>
        )}

        <div className="dashboard-sections">
          <div className="recent-activity">
            <h2>Recent Borrow Requests</h2>
            {recentRequests.length > 0 ? (
              <div className="requests-list">
                {recentRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-info">
                      <h4>{request.equipment_name}</h4>
                      <p>Requested: {new Date(request.request_date).toLocaleDateString()}</p>
                      <p>Period: {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="request-status">
                      <span className={`badge badge-${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent requests found.</p>
            )}
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <a href="/equipment" className="btn btn-primary">Browse Equipment</a>
              <a href="/borrow-requests" className="btn btn-secondary">My Requests</a>
              {(user.role === 'admin' || user.role === 'staff') && (
                <a href="/admin" className="btn btn-success">Admin Panel</a>
              )}
            </div>
          </div>
        </div>

        {(user.role === 'admin' || user.role === 'staff') && stats && (
          <div className="admin-stats">
            <h2>System Overview</h2>
            <div className="admin-stats-grid">
              <div className="stat-card">
                <h3>Pending Requests</h3>
                <div className="stat-number">{stats.pendingRequests || 0}</div>
              </div>
              
              <div className="stat-card">
                <h3>Overdue Returns</h3>
                <div className="stat-number">{stats.overdueReturns || 0}</div>
              </div>
              
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-number">{stats.totalUsers || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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

export default Dashboard;