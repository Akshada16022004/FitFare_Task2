
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: 'Basic',
    status: 'Active'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from:', `${API_BASE_URL}/api/users`);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      console.log('Users fetched successfully:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      setUsers([
        { 
          _id: '1', 
          name: 'John Smith', 
          email: 'john@example.com', 
          membershipType: 'Premium', 
          status: 'Active', 
          joinDate: '2023-10-15',
          lastVisit: '2024-01-10'
        },
        { 
          _id: '2', 
          name: 'Sarah Johnson', 
          email: 'sarah@example.com', 
          membershipType: 'VIP', 
          status: 'Active', 
          joinDate: '2023-11-20',
          lastVisit: '2024-01-12'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage('');

    console.log('Adding user with data:', formData);
    console.log('Making request to:', `${API_BASE_URL}/api/auth/register`);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        membershipType: formData.membershipType,
        status: formData.status,
        role: 'user'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Add user response:', response.data);
      
      setMessage('User added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        membershipType: 'Basic',
        status: 'Active'
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error('Add user error details:');
      console.error('Error message:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Response headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add user';
      setMessage(`Error: ${errorMessage} (Status: ${error.response?.status})`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Active: { bgColor: '#d4edda', textColor: '#155724' },
      Inactive: { bgColor: '#f8d7da', textColor: '#721c24' },
      Suspended: { bgColor: '#fff3cd', textColor: '#856404' },
    };

    const config = statusConfig[status] || { bgColor: '#e2e3e5', textColor: '#383d41' };

    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: config.bgColor, 
          color: config.textColor 
        }}
      >
        {status}
      </span>
    );
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        console.log('Deleting user with ID:', userId);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Error: No authentication token found');
          return;
        }

        const response = await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Delete response:', response.data);
        setMessage('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Delete user error:', error);
        console.error('Delete error details:', error.response?.data);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
        setMessage(`Error: ${errorMessage}`);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h2 className="page-title">Manage Users</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i>
          Add New User
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Membership</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=4361ee&color=fff`}
                      alt={user.name}
                      className="user-avatar"
                    />
                    <div>
                      <div className="user-name">{user.name}</div>
                      {user.role === 'admin' && (
                        <div className="admin-badge">Admin</div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`membership-badge membership-${user.membershipType?.toLowerCase() || 'basic'}`}>
                    {user.membershipType || 'Basic'}
                  </span>
                </td>
                <td>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>{user.lastVisit ? new Date(user.lastVisit).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    {/* Only show delete button for non-admin users */}
                    {user.role !== 'admin' && (
                      <button 
                        className="btn-action btn-delete" 
                        title="Delete User"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                      >
                        <i className="fas fa-trash"></i>
                        <span className="action-text">Delete</span>
                      </button>
                    )}
                    {/* Show disabled button for admin users */}
                    {user.role === 'admin' && (
                      <button 
                        className="btn-action btn-disabled" 
                        title="Cannot delete admin user"
                        disabled
                      >
                        <i className="fas fa-shield-alt"></i>
                        <span className="action-text">Admin</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  minLength="6"
                />
                <small className="help-text">Minimum 6 characters</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Membership Type</label>
                  <select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleInputChange}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Add User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;