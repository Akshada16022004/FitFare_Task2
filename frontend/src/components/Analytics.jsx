import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [timeRange, setTimeRange] = useState('last6months');
  const [loading, setLoading] = useState(true);

  const membershipData = [
    { name: 'Basic', value: 45 },
    { name: 'Premium', value: 35 },
    { name: 'VIP', value: 20 },
  ];
  const COLORS = ['#4361ee', '#3a0ca3', '#7209b7'];

  const timeRanges = [
    { key: 'last6months', label: 'Last 6 Months' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'custom', label: '1 Year' }
  ];

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  // Dynamic mock data generator
  const generateRevenueData = (range) => {
    const now = new Date();
    const data = [];

    if (range === 'last6months') {
      // Monthly data for last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = d.toLocaleString('default', { month: 'short' });
        const revenue = 3000 + i * 500; // distinct pattern
        const orders = 25 + i * 7;
        data.push({ month, revenue, orders });
      }
    } else if (range === 'thisMonth') {
      // Daily data for current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const revenue = 100 + i * 25; // distinct pattern
        const orders = 2 + (i % 5);
        data.push({ month: `Day ${i}`, revenue, orders });
      }
    } else if (range === '1 year') {
      // Weekly data for 4 weeks
      for (let i = 1; i <= 4; i++) {
        const revenue = 1200 + i * 400;
        const orders = 12 + i * 6;
        data.push({ month: `Week ${i}`, revenue, orders });
      }
    }

    return data;
  };

  // Fetch data (API fallback to dynamic mock)
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics/revenue?range=${timeRange}`);
      setRevenueData(response.data);
    } catch (error) {
      setRevenueData(generateRevenueData(timeRange));
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
    totalOrders: revenueData.reduce((sum, item) => sum + item.orders, 0),
    averageOrderValue: revenueData.reduce((sum, item) => sum + item.revenue, 0) /
                       (revenueData.reduce((sum, item) => sum + item.orders, 0) || 1)
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Analytics Overview</h1>
            <p className="page-subtitle">Track your business performance and growth metrics</p>
          </div>
          <div className="time-filters">
            {timeRanges.map(tr => (
              <button
                key={tr.key}
                className={`time-filter-btn ${timeRange === tr.key ? 'active' : ''}`}
                onClick={() => setTimeRange(tr.key)}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats">
        {[
          { icon: 'fas fa-chart-line', title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, trend: '+12.5%', type: 'primary' },
          { icon: 'fas fa-shopping-cart', title: 'Total Orders', value: stats.totalOrders, trend: '+8.3%', type: 'secondary' },
          { icon: 'fas fa-user-plus', title: 'New Members', value: 89, trend: '+15.2%', type: 'success' },
          { icon: 'fas fa-percentage', title: 'Avg. Order Value', value: `$${stats.averageOrderValue.toFixed(2)}`, trend: '+5.7%', type: 'warning' }
        ].map((card, idx) => (
          <div key={idx} className={`stat-card ${card.type}`}>
            <div className="stat-icon"><i className={card.icon}></i></div>
            <div className="stat-details">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
              <span className={`stat-trend ${card.trend.startsWith('+') ? 'positive' : 'negative'}`}>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {/* Revenue Trend */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Trend</h3>
            <div className="chart-actions">
              <span className="chart-period">{timeRanges.find(tr => tr.key === timeRange).label}</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={value => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4361ee" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Orders */}
        <div className="chart-card">
          <div className="chart-header"><h3 className="chart-title">Revenue vs Orders</h3></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value}` : value, name]} />
                <Legend />
                <Bar dataKey="revenue" fill="#4361ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#4cc9f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="chart-card">
          <div className="chart-header"><h3 className="chart-title">Membership Distribution</h3></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={membershipData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {membershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

