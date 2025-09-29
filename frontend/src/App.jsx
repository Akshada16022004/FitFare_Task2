 import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import Orders from './components/Orders';
import Feedback from './components/Feedback';
import Login from './components/Login';
import './App.css';

// Create a separate component that uses the AuthContext
const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'users', label: 'Manage Users', icon: 'fas fa-users' },
    { id: 'analytics', label: 'View Analytics', icon: 'fas fa-chart-bar' },
    { id: 'orders', label: 'Orders Summary', icon: 'fas fa-shopping-cart' },
    { id: 'feedback', label: 'Feedback & Ratings', icon: 'fas fa-star' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'orders':
        return <Orders />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <i className="fas fa-dumbbell fa-spin"></i>
          <p>Loading GymPro Dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  // Show main app if authenticated
  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <i className="fas fa-dumbbell logo-icon"></i>
            <h1>Fit<span>Fare</span></h1>
          </div>
          
          <div className="header-actions">
            <div className="notification-icon">
              <i className="fas fa-bell"></i>
              {/* <span className="notification-badge"></span> */}
            </div>
            
            {/* <div className="user-profile">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                alt="Profile" 
                className="profile-image"
              />
              <span>{user.name} (Admin)</span>
              <i className="fas fa-chevron-down"></i>
            </div> */}

            <div className="user-profile">
  <div className="profile-avatar">
    {user.name.charAt(0).toUpperCase()}
  </div>
  <span>{user.name} (Admin)</span>
  <i className="fas fa-chevron-down"></i>
</div>


          </div>
        </div> 
 
        
        <nav className="nav-container">
          <ul className="nav-tabs">
            {tabs.map(tab => (
              <li 
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </li>
            ))}
            
            <li 
              className="nav-tab logout-tab"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Main App component that doesn't use AuthContext directly
const App = () => {
  return <AppContent />;
};

export default App;