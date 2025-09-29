import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const Dashboard = ({ data }) => {
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4000, members: 120 },
    { month: 'Feb', revenue: 3000, members: 98 },
    { month: 'Mar', revenue: 5000, members: 150 },
    { month: 'Apr', revenue: 2780, members: 110 },
    { month: 'May', revenue: 1890, members: 85 },
    { month: 'Jun', revenue: 2390, members: 105 },
  ];

  const membershipData = [
    { name: 'Basic', value: 45 },
    { name: 'Premium', value: 35 },
    { name: 'VIP', value: 20 },
  ];

  const COLORS = ['#4361ee', '#3a0ca3', '#7209b7'];

  const statCards = [
    {
      label: 'Total Members',
      value: data?.totalUsers || 1248,
      icon: 'fas fa-users',
      color: '#4361ee'
    },
    {
      label: 'Active Members',
      value: data?.activeUsers || 892,
      icon: 'fas fa-user-check',
      color: '#4cc9f0'
    },
    {
      label: 'Total Revenue',
      value: `$${data?.totalRevenue?.toLocaleString() || '42,580'}`,
      icon: 'fas fa-dollar-sign',
      color: '#06d6a0'
    },
    {
      label: 'Monthly Revenue',
      value: `$${data?.monthlyRevenue?.toLocaleString() || '8,420'}`,
      icon: 'fas fa-chart-line',
      color: '#ff9e00'
    }
  ];

  const recentMembers = [
    { name: 'John Smith', joinDate: '2023-10-15', membership: 'Premium', status: 'Active', lastVisit: '2024-01-10' },
    { name: 'Sarah Johnson', joinDate: '2023-11-20', membership: 'VIP', status: 'Active', lastVisit: '2024-01-12' },
    { name: 'Mike Davis', joinDate: '2023-09-05', membership: 'Basic', status: 'Active', lastVisit: '2024-01-11' },
    { name: 'Emily Wilson', joinDate: '2023-12-10', membership: 'Premium', status: 'Active', lastVisit: '2024-01-09' },
  ];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Active: { bgColor: '#d4edda', textColor: '#155724' },
      Pending: { bgColor: '#fff3cd', textColor: '#856404' },
      Completed: { bgColor: '#d1ecf1', textColor: '#0c5460' },
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

  const QuickActionButton = ({ icon, label, color, onClick }) => (
    <button 
      className="quick-action-btn"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div 
              className="stat-icon"
              style={{ backgroundColor: stat.color }}
            >
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Revenue & Membership Growth</h3>
            <div className="chart-actions">
              <button className="btn-outline">Monthly</button>
              <button className="btn-primary">Yearly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4361ee" 
                strokeWidth={2} 
                name="Revenue ($)"
              />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#4cc9f0" 
                strokeWidth={2} 
                name="New Members"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4361ee" name="Revenue ($)" />
              <Bar dataKey="members" fill="#4cc9f0" name="New Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Quick Actions</h3>
          <div className="quick-actions">
            <QuickActionButton
              icon="fas fa-plus"
              label="Add New Member"
              color="#4361ee"
              onClick={() => console.log('Add new member')}
            />
            <QuickActionButton
              icon="fas fa-chart-bar"
              label="Generate Report"
              color="#06d6a0"
              onClick={() => console.log('Generate report')}
            />
            <QuickActionButton
              icon="fas fa-bell"
              label="Send Notification"
              color="#ff9e00"
              onClick={() => console.log('Send notification')}
            />
          </div>
        </div>
      </div>

      {/* Recent Members Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Recent Members</h3>
          <button className="btn-primary">
            <i className="fas fa-plus"></i>
            Add New
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Join Date</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {recentMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>{member.joinDate}</td>
                <td>{member.membership}</td>
                <td>
                  <StatusBadge status={member.status} />
                </td>
                <td>{member.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;




