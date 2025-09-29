import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(loginData.email, loginData.password);
    
    if (!result.success) {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Note: Registration will create user but only admin can login to dashboard
    const result = await login(registerData.email, registerData.password);
    
    if (!result.success) {
      setMessage(result.message || 'Registration successful but only admin can login to dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-dumbbell logo-icon"></i>
          <h1>Fit<span>Fare</span></h1>
          <p>Gym Owner Dashboard</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Admin Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="Enter admin email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              <i className="fas fa-sign-in-alt"></i>
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>

            <div className="demo-credentials">
              <p><strong>Default Admin Credentials:</strong></p>
              <p>Email: admin@gympro.com</p>
              <p>Password: admin123</p>
              <p className="note">Note: Only admin users can access the dashboard</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="Enter password (min 6 characters)"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              <i className="fas fa-user-plus"></i>
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="demo-credentials">
              <p><strong>Important:</strong></p>
              <p>Registration will create a user account, but only admin users can login to the dashboard.</p>
              <p>Contact system administrator for admin access.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;