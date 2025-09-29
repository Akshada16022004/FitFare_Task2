import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    userName: '',
    email: '',
    amount: '',
    type: 'Membership',
    paymentMethod: 'Credit Card'
  });

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('gymOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
      setLoading(false);
    } else {
      fetchOrders();
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('gymOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      const ordersData = response.data;
      setOrders(ordersData);
      localStorage.setItem('gymOrders', JSON.stringify(ordersData));
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback mock data
      const mockOrders = [
        { 
          _id: '1', 
          userName: 'John Smith',
          email: 'john@example.com',
          amount: 99.99,
          type: 'Membership',
          status: 'Completed',
          date: '2024-01-10',
          paymentMethod: 'Credit Card'
        },
        { 
          _id: '2', 
          userName: 'Sarah Johnson',
          email: 'sarah@example.com',
          amount: 199.99,
          type: 'Personal Training',
          status: 'Pending',
          date: '2024-01-12',
          paymentMethod: 'PayPal'
        },
        { 
          _id: '3', 
          userName: 'Mike Davis',
          email: 'mike@example.com',
          amount: 49.99,
          type: 'Supplements',
          status: 'Completed',
          date: '2024-01-11',
          paymentMethod: 'Credit Card'
        },
        { 
          _id: '4', 
          userName: 'Emily Wilson',
          email: 'emily@example.com',
          amount: 299.99,
          type: 'Equipment',
          status: 'Completed',
          date: '2024-01-09',
          paymentMethod: 'Bank Transfer'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('gymOrders', JSON.stringify(mockOrders));
    } finally {
      setLoading(false);
    }
  };

  // Generate sequential ID - Simple and reliable
  const generateOrderId = () => {
    if (orders.length === 0) return '1';
    
    // Get all numeric IDs and find the maximum
    const numericIds = orders
      .map(order => {
        const id = parseInt(order._id);
        return isNaN(id) ? 0 : id;
      });
    
    const maxId = Math.max(...numericIds);
    return (maxId + 1).toString();
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    return filter === 'all' || order.status === filter;
  });

  // Add new order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const orderId = generateOrderId();
      console.log('Generated Order ID:', orderId); // Debug log
      
      const orderData = {
        ...newOrder,
        _id: orderId,
        amount: parseFloat(newOrder.amount),
        status: 'Completed',
        date: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      const updatedOrders = [...orders, response.data];
      setOrders(updatedOrders);
      
      setShowAddModal(false);
      setNewOrder({
        userName: '',
        email: '',
        amount: '',
        type: 'Membership',
        paymentMethod: 'Credit Card'
      });
      alert('Order added successfully!');
    } catch (error) {
      console.error('Error adding order:', error);
      // Use localStorage as fallback
      const orderId = generateOrderId();
      console.log('Generated Order ID (fallback):', orderId); // Debug log
      
      const demoOrder = {
        _id: orderId,
        ...newOrder,
        amount: parseFloat(newOrder.amount),
        status: 'Completed',
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedOrders = [...orders, demoOrder];
      setOrders(updatedOrders);
      
      setShowAddModal(false);
      setNewOrder({
        userName: '',
        email: '',
        amount: '',
        type: 'Membership',
        paymentMethod: 'Credit Card'
      });
      alert('Order added successfully!');
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        // Use localStorage as fallback
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        alert('Order deleted successfully!');
      }
    }
  };

  // ... rest of your component code (export functions, JSX, etc.) remains the same

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Type', 'Amount', 'Status', 'Date', 'Payment Method'];
    const csvData = filteredOrders.map(order => [
      order._id,
      order.userName,
      order.email,
      order.type,
      `$${order.amount}`,
      order.status,
      order.date,
      order.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Export orders to PDF (Simple version without external libraries)
  const exportToPDFPrint = () => {
    const printWindow = window.open('', '_blank');
    const tableContent = `
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 10px; }
            .report-info { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4361ee; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .total-row { background-color: #e8f4fd !important; font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Orders Report</h1>
          <div class="report-info">
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Orders:</strong> ${filteredOrders.length}</p>
            <p><strong>Filter:</strong> ${filter === 'all' ? 'All Orders' : filter}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order._id}</td>
                  <td>${order.userName}</td>
                  <td>${order.email}</td>
                  <td>${order.type}</td>
                  <td>$${order.amount}</td>
                  <td>${order.status}</td>
                  <td>${order.date}</td>
                  <td>${order.paymentMethod}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4"><strong>Total</strong></td>
                <td><strong>$${filteredOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}</strong></td>
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4361ee; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print as PDF
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(tableContent);
    printWindow.document.close();
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Completed: { bgColor: '#d4edda', textColor: '#155724' },
      Pending: { bgColor: '#fff3cd', textColor: '#856404' },
      Cancelled: { bgColor: '#f8d7da', textColor: '#721c24' },
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

  const TypeBadge = ({ type }) => {
    const typeConfig = {
      Membership: { bgColor: '#4361ee', textColor: 'white' },
      'Personal Training': { bgColor: '#4cc9f0', textColor: 'white' },
      Supplements: { bgColor: '#06d6a0', textColor: 'white' },
      Equipment: { bgColor: '#ff9e00', textColor: 'white' },
    };

    const config = typeConfig[type] || { bgColor: '#6c757d', textColor: 'white' };

    return (
      <span 
        className="type-badge"
        style={{ 
          backgroundColor: config.bgColor, 
          color: config.textColor 
        }}
      >
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Orders Management</h2>
        <div className="header-actions">
          <div className="export-dropdown">
            <button className="btn-outline">
              <i className="fas fa-download"></i>
              Export
            </button>
            <div className="export-menu">
              <button onClick={exportToCSV}>Download as CSV</button>
              <button onClick={exportToPDFPrint}>Download as PDF</button>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i>
            New Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4361ee' }}>
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#06d6a0' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {orders.filter(order => order.status === 'Completed').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ff9e00' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {orders.filter(order => order.status === 'Pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f72585' }}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {orders.filter(order => order.status === 'Cancelled').length}
            </div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons Only (No Search) */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('Cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <div className="table-info">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>#{order._id}</td>
                <td className="customer-cell">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {order.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="customer-name">{order.userName}</div>
                    </div>
                  </div>
                </td>
                <td>{order.email}</td>
                <td>
                  <TypeBadge type={order.type} />
                </td>
                <td>${order.amount}</td>
                <td>{order.paymentMethod}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <i className="fas fa-box-open"></i>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Order</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={newOrder.userName}
                  onChange={(e) => setNewOrder({...newOrder, userName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newOrder.email}
                  onChange={(e) => setNewOrder({...newOrder, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Order Type</label>
                <select
                  value={newOrder.type}
                  onChange={(e) => setNewOrder({...newOrder, type: e.target.value})}
                >
                  <option value="Membership">Membership</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={newOrder.paymentMethod}
                  onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;