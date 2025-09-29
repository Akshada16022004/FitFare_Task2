import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import './Dashboard.css';

const Dashboard = ({ data, onTabChange }) => {
  const [dateRange, setDateRange] = useState('last6months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [animatedStats, setAnimatedStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });

  // Modal states
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Chart data states
  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);

  // Form states
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'all'
  });

  const [reportSettings, setReportSettings] = useState({
    type: 'monthly',
    format: 'pdf',
    includeCharts: true
  });

  const [settings, setSettings] = useState({
    refreshRate: '30',
    defaultDateRange: 'last6months',
    emailNotifications: true,
    weeklyReports: true
  });

  // Initialize dates and load initial data
  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
    
    setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    // Load initial chart data
    loadChartData('last6months');
    
    // Animate stats counting up
    const timer = setTimeout(() => {
      setAnimatedStats({
        totalMembers: data?.totalUsers || 1248,
        activeMembers: data?.activeUsers || 892,
        totalRevenue: data?.totalRevenue || 42580,
        monthlyRevenue: data?.monthlyRevenue || 8420
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  // Load chart data based on date range
  const loadChartData = (range) => {
    let revenueData = [];
    let performanceData = [];
    let membershipData = [];

    switch(range) {
      case 'last6months':
        revenueData = [
          { month: 'Jul', revenue: 4200, members: 125, expenses: 2100 },
          { month: 'Aug', revenue: 3800, members: 110, expenses: 1900 },
          { month: 'Sep', revenue: 4500, members: 140, expenses: 2300 },
          { month: 'Oct', revenue: 5200, members: 160, expenses: 2600 },
          { month: 'Nov', revenue: 4800, members: 150, expenses: 2400 },
          { month: 'Dec', revenue: 5500, members: 170, expenses: 2800 },
        ];
        break;
      
      case 'thisYear':
        revenueData = [
          { month: 'Jan', revenue: 4000, members: 120, expenses: 2200 },
          { month: 'Feb', revenue: 3800, members: 115, expenses: 2100 },
          { month: 'Mar', revenue: 4500, members: 135, expenses: 2400 },
          { month: 'Apr', revenue: 4200, members: 130, expenses: 2300 },
          { month: 'May', revenue: 4800, members: 145, expenses: 2500 },
          { month: 'Jun', revenue: 5200, members: 155, expenses: 2700 },
          { month: 'Jul', revenue: 5500, members: 165, expenses: 2800 },
          { month: 'Aug', revenue: 5800, members: 170, expenses: 2900 },
          { month: 'Sep', revenue: 5300, members: 160, expenses: 2700 },
          { month: 'Oct', revenue: 6000, members: 180, expenses: 3000 },
          { month: 'Nov', revenue: 5800, members: 175, expenses: 2900 },
          { month: 'Dec', revenue: 6200, members: 185, expenses: 3100 },
        ];
        break;
      
      case 'thisMonth':
        revenueData = [
          { day: 'Week 1', revenue: 1200, members: 35, expenses: 600 },
          { day: 'Week 2', revenue: 1800, members: 42, expenses: 900 },
          { day: 'Week 3', revenue: 2200, members: 55, expenses: 1100 },
          { day: 'Week 4', revenue: 1900, members: 48, expenses: 950 },
        ];
        break;
      
      default:
        revenueData = [
          { month: 'Jan', revenue: 4000, members: 120, expenses: 2200 },
          { month: 'Feb', revenue: 3000, members: 98, expenses: 1800 },
          { month: 'Mar', revenue: 5000, members: 150, expenses: 2500 },
        ];
    }

    // Update performance data based on range
    if (range === 'thisMonth') {
      performanceData = [
        { day: 'Week 1', visits: 450, signups: 45 },
        { day: 'Week 2', visits: 520, signups: 52 },
        { day: 'Week 3', visits: 480, signups: 48 },
        { day: 'Week 4', visits: 510, signups: 51 },
      ];
    } else {
      performanceData = [
        { day: 'Mon', visits: 120, signups: 15 },
        { day: 'Tue', visits: 145, signups: 18 },
        { day: 'Wed', visits: 98, signups: 12 },
        { day: 'Thu', visits: 167, signups: 22 },
        { day: 'Fri', visits: 132, signups: 16 },
        { day: 'Sat', visits: 110, signups: 14 },
        { day: 'Sun', visits: 95, signups: 11 },
      ];
    }

    // Update membership distribution slightly based on range
    membershipData = [
      { name: 'Basic', value: range === 'thisYear' ? 42 : 45 },
      { name: 'Premium', value: range === 'thisYear' ? 38 : 35 },
      { name: 'VIP', value: range === 'thisYear' ? 20 : 20 },
    ];

    setRevenueData(revenueData);
    setPerformanceData(performanceData);
    setMembershipData(membershipData);
  };

  // Handle date range changes - UPDATED
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    const today = new Date();
    let newStartDate = new Date();
    
    switch(range) {
      case 'last6months':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case 'thisYear':
        newStartDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'thisMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }
    
    setStartDate(newStartDate.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    // Load new chart data based on selected range
    loadChartData(range);
  };

  const handleCustomRangeApply = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    
    setDateRange('custom');
    // Load custom range data
    loadChartData('custom');
  };

  // Quick Actions Handlers - UPDATED
  const handleAddMember = () => {
    // Redirect to Manage Users tab
    if (onTabChange) {
      onTabChange('manageUsers');
    }
  };

  const handleGenerateReport = () => {
    setShowGenerateReport(true);
  };

  const handleSendNotification = () => {
    setShowSendNotification(true);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  // Generate PDF Report - NEW FUNCTION
  const generatePDFReport = () => {
    // Create a simple PDF using browser's print functionality
    const printContent = `
      <html>
        <head>
          <title>Dashboard Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #4361ee; padding-bottom: 10px; }
            .section { margin: 20px 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4361ee; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #4361ee; color: white; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Membership Dashboard Report</h1>
          
          <div class="section">
            <h3>Report Details</h3>
            <p><strong>Date Range:</strong> ${getRangeDisplayText()}</p>
            <p><strong>Report Type:</strong> ${reportSettings.type}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h3>Key Statistics</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <strong>Total Members:</strong> ${animatedStats.totalMembers.toLocaleString()}
              </div>
              <div class="stat-card">
                <strong>Active Members:</strong> ${animatedStats.activeMembers.toLocaleString()}
              </div>
              <div class="stat-card">
                <strong>Total Revenue:</strong> $${animatedStats.totalRevenue.toLocaleString()}
              </div>
              <div class="stat-card">
                <strong>Monthly Revenue:</strong> $${animatedStats.monthlyRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Recent Members</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Join Date</th>
                  <th>Membership</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${recentMembers.map(member => `
                  <tr>
                    <td>${member.name}</td>
                    <td>${member.joinDate}</td>
                    <td>${member.membership}</td>
                    <td>${member.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Generated by Membership Management System</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  const handleGenerateReportSubmit = (e) => {
    e.preventDefault();
    
    if (reportSettings.format === 'pdf') {
      // Generate and download PDF
      generatePDFReport();
      alert('PDF report is being generated. Please check your print dialog to save as PDF.');
    } else {
      // For other formats
      alert(`${reportSettings.type} report generated in ${reportSettings.format} format!`);
    }
    
    setShowGenerateReport(false);
  };

  const handleSendNotificationSubmit = (e) => {
    e.preventDefault();
    console.log('Sending notification:', notification);
    
    // Simulate sending notification
    setTimeout(() => {
      alert(`Notification sent successfully to ${notification.type} members!`);
      setShowSendNotification(false);
      setNotification({
        title: '',
        message: '',
        type: 'all'
      });
    }, 1000);
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    
    // Apply default date range if changed
    if (settings.defaultDateRange !== dateRange) {
      handleDateRangeChange(settings.defaultDateRange);
    }
    
    alert('Settings saved successfully!');
    setShowSettings(false);
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get display text for selected range
  const getRangeDisplayText = () => {
    switch(dateRange) {
      case 'last6months':
        return 'Last 6 Months';
      case 'thisYear':
        return 'This Year';
      case 'thisMonth':
        return 'This Month';
      case 'custom':
        return `Custom: ${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;
      default:
        return 'Select Date Range';
    }
  };

  const COLORS = ['#4361ee', '#3a0ca3', '#7209b7', '#4cc9f0', '#06d6a0'];

  const statCards = [
    {
      label: 'Total Members',
      value: animatedStats.totalMembers,
      icon: 'fas fa-users',
      color: '#4361ee',
      suffix: '',
      isCurrency: false
    },
    {
      label: 'Active Members',
      value: animatedStats.activeMembers,
      icon: 'fas fa-user-check',
      color: '#4cc9f0',
      suffix: '',
      isCurrency: false
    },
    {
      label: 'Total Revenue',
      value: animatedStats.totalRevenue,
      icon: 'fas fa-dollar-sign',
      color: '#06d6a0',
      suffix: '',
      isCurrency: true
    },
    {
      label: 'Monthly Revenue',
      value: animatedStats.monthlyRevenue,
      icon: 'fas fa-chart-line',
      color: '#ff9e00',
      suffix: '',
      isCurrency: true
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

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const formatStatValue = (value, isCurrency = false) => {
    if (isCurrency) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="dashboard">
      {/* Header with Date Range Selector */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Performance</h1>
          <p>Analyze your membership data and performance metrics</p>
        </div>
        
        <div className="date-range-selector">
          <div className="date-buttons">
            <button 
              className={`date-btn ${dateRange === 'last6months' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('last6months')}
            >
              Last 6 Months
            </button>
            <button 
              className={`date-btn ${dateRange === 'thisYear' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('thisYear')}
            >
              This Year
            </button>
            <button 
              className={`date-btn ${dateRange === 'thisMonth' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('thisMonth')}
            >
              This Month
            </button>
          </div>
          
          <div className="custom-range">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button 
              className="apply-btn"
              onClick={handleCustomRangeApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Display */}
      <div className="date-range-display">
        <h3>Showing data for: <span>{getRangeDisplayText()}</span></h3>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div 
                className="stat-icon"
                style={{ backgroundColor: stat.color }}
              >
                <i className={stat.icon}></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">
                  {formatStatValue(stat.value, stat.isCurrency)}
                </h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i>
              <span>12.5%</span>
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
              <span className="data-info">Data updates based on selected date range</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dateRange === 'thisMonth' ? 'day' : 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4361ee" 
                fill="#4361ee"
                fillOpacity={0.2}
                strokeWidth={2} 
                name="Revenue ($)"
              />
              <Area 
                type="monotone" 
                dataKey="members" 
                stroke="#4cc9f0" 
                fill="#4cc9f0"
                fillOpacity={0.2}
                strokeWidth={2} 
                name="New Members"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
{/* 
        <div className="chart-container">
          <h3 className="chart-title">Membership Distribution</h3>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={250}>
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
            <div className="membership-legend">
              {membershipData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>*/}

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

      {/* Second Charts Row */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">
            {dateRange === 'thisMonth' ? 'Monthly Performance' : 'Weekly Performance'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#4361ee" name="Website Visits" radius={[4, 4, 0, 0]} />
              <Bar dataKey="signups" fill="#4cc9f0" name="New Signups" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Quick Actions</h3>
          <div className="quick-actions">
            {/* <QuickActionButton
              icon="fas fa-plus"
              label="Add New Member"
              color="#4361ee"
              onClick={handleAddMember}
            /> */}
            <QuickActionButton
              icon="fas fa-chart-bar"
              label="Generate Report"
              color="#06d6a0"
              onClick={handleGenerateReport}
            />
            <QuickActionButton
              icon="fas fa-bell"
              label="Send Notification"
              color="#ff9e00"
              onClick={handleSendNotification}
            />
            <QuickActionButton
              icon="fas fa-cog"
              label="Settings"
              color="#7209b7"
              onClick={handleOpenSettings}
            />
          </div>
          
          {/* <div className="recent-activity">
            <h4>Recent Activity</h4>
            <ul>
              <li>
                <i className="fas fa-user-plus"></i>
                <span>New member registered</span>
                <span className="activity-time">2 hours ago</span>
              </li>
              <li>
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Monthly report generated</span>
                <span className="activity-time">1 day ago</span>
              </li>
              <li>
                <i className="fas fa-sync-alt"></i>
                <span>System backup completed</span>
                <span className="activity-time">2 days ago</span>
              </li>
            </ul>
          </div>*/}
        </div>
      </div> 

      {/* Recent Members Table
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Recent Members</h3>
          <button className="btn-primary" onClick={handleAddMember}>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentMembers.map((member, index) => (
              <tr key={index}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </td>
                <td>{member.joinDate}</td>
                <td>
                  <span className={`membership-badge ${member.membership.toLowerCase()}`}>
                    {member.membership}
                  </span>
                </td>
                <td>
                  <StatusBadge status={member.status} />
                </td>
                <td>{member.lastVisit}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Modals - Removed Add Member Modal */}
      <Modal isOpen={showGenerateReport} onClose={() => setShowGenerateReport(false)} title="Generate Report">
        <form onSubmit={handleGenerateReportSubmit} className="modal-form">
          <div className="form-group">
            <label>Report Type</label>
            <select 
              value={reportSettings.type}
              onChange={(e) => setReportSettings({...reportSettings, type: e.target.value})}
            >
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>
          <div className="form-group">
            <label>Format</label>
            <select 
              value={reportSettings.format}
              onChange={(e) => setReportSettings({...reportSettings, format: e.target.value})}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={reportSettings.includeCharts}
                onChange={(e) => setReportSettings({...reportSettings, includeCharts: e.target.checked})}
              />
              Include Charts and Graphs
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={() => setShowGenerateReport(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Generate Report
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSendNotification} onClose={() => setShowSendNotification(false)} title="Send Notification">
        <form onSubmit={handleSendNotificationSubmit} className="modal-form">
          <div className="form-group">
            <label>Notification Title</label>
            <input 
              type="text" 
              value={notification.title}
              onChange={(e) => setNotification({...notification, title: e.target.value})}
              placeholder="Enter notification title"
              required 
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea 
              value={notification.message}
              onChange={(e) => setNotification({...notification, message: e.target.value})}
              placeholder="Enter your message"
              rows="4"
              required 
            />
          </div>
          <div className="form-group">
            <label>Send To</label>
            <select 
              value={notification.type}
              onChange={(e) => setNotification({...notification, type: e.target.value})}
            >
              <option value="all">All Members</option>
              <option value="basic">Basic Members Only</option>
              <option value="premium">Premium Members Only</option>
              <option value="vip">VIP Members Only</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={() => setShowSendNotification(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Notification
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <form onSubmit={handleSettingsSave} className="modal-form">
          <div className="form-group">
            <label>Dashboard Refresh Rate</label>
            <select 
              value={settings.refreshRate}
              onChange={(e) => setSettings({...settings, refreshRate: e.target.value})}
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Default Date Range</label>
            <select 
              value={settings.defaultDateRange}
              onChange={(e) => setSettings({...settings, defaultDateRange: e.target.value})}
            >
              <option value="last6months">Last 6 Months</option>
              <option value="thisYear">This Year</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
              Email notifications for new members
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={settings.weeklyReports}
                onChange={(e) => setSettings({...settings, weeklyReports: e.target.checked})}
              />
              Weekly report automation
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={() => setShowSettings(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;