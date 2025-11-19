import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, FormInput, Alert } from '../../components/UI';
import { HomeIcon } from '../../components/Shared/Icons';
import './styles/LoginPage.css';
import { FcGoogle } from "react-icons/fc";

export function LoginPage(){
  const { login, register, isLoading, handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('student');

  // Messages
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

 // Handle Google OAuth callback
useEffect(() => {
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const role = searchParams.get('role');
  const id = searchParams.get('id'); // 🔥 newly added

  if (token && email) {
    handleGoogleCallback({ token, email, name, role, id }); // 🔥 include id
    navigate('/');
  }
}, [searchParams, handleGoogleCallback, navigate]);


  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const logoutParam = searchParams.get('logout');

    if (tabParam === 'register' && activeTab !== 'register') {
      setActiveTab('register');
    } else if (tabParam !== 'register' && activeTab !== 'login') {
      setActiveTab('login');
    }

    if (logoutParam === 'success') {
      setLoginSuccess('You have been successfully logged out!');
      setTimeout(() => setLoginSuccess(''), 5000);
    }
  }, [searchParams, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginError('Please enter a valid email address');
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters');
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      setLoginSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError('Please fill in all fields');
      return;
    }

    if (registerName.length < 2) {
      setRegisterError('Name must be at least 2 characters');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      setRegisterError('Please enter a valid email address');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register(registerName, registerEmail, registerPassword, registerRole);
      setRegisterSuccess(result.message || 'Account created successfully!');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('student');

      setTimeout(() => {
        setActiveTab('login');
        setRegisterSuccess('');
        setLoginSuccess('Account created successfully! Please login with your credentials.');
        setTimeout(() => setLoginSuccess(''), 5000);
      }, 2000);
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        <div className="login-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="login-logo">
            <div className="nav-logo-icon"><HomeIcon size={24} /></div>
          </div>
          <span className="login-title">BoardingHouseFinder</span>
        </div>
        <p className="login-subtitle">
          Find your perfect student accommodation
        </p>

        <Card className="login-card-tabs">
          <div className="login-tabs-list">
            <button
            className={`login-tab-trigger ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => navigate('/login')}
            disabled={isLoading}
            >
              Login
              </button>
              <button
              className={`login-tab-trigger ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => navigate('/login?tab=register')}
              disabled={isLoading}
              >
                Register
                </button>
                </div>
                {/* Login Tab */}
                {activeTab === 'login' && (
                  <div className="login-tab-content">
              <div className="login-tab-header">
                <h3>Welcome back</h3>
                <p>Enter your credentials to access your account</p>
              </div>
              <form onSubmit={handleLogin} className="form-layout">
                {loginSuccess && <Alert variant="success">{loginSuccess}</Alert>}
                {loginError && <Alert variant="error">{loginError}</Alert>}

                <button
                type="button"
                onClick={handleGoogleLogin}
                className="button button-secondary button-full-width google-button"
                disabled={isLoading}
                >
                  <FcGoogle size={20} style={{ marginRight: "8px" }} />
                  Continue with Google
                  </button>
                  <div className="divider">
                  <span>OR</span>
                </div>

                <FormInput
                  id="login-email"
                  label="Email"
                  type="email"
                  placeholder="student@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />

                <FormInput
                  id="login-password"
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />

                <button 
                  type="submit" 
                  className="button button-primary button-full-width" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          )}

          {/* Register Tab */}
          {activeTab === 'register' && (
            <div className="login-tab-content">
              <div className="login-tab-header">
                <h3>Create an account</h3>
                <p>Enter your information to get started</p>
              </div>
              <form onSubmit={handleRegister} className="form-layout">
                {registerSuccess && <Alert variant="success">{registerSuccess}</Alert>}
                {registerError && <Alert variant="error">{registerError}</Alert>}

                <button
                type="button"
                onClick={handleGoogleLogin}
                className="button button-secondary button-full-width google-button"
                disabled={isLoading}
                >
                  <FcGoogle size={20} style={{ marginRight: "8px" }} />
                  Sign up with Google
                  </button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <FormInput
                  id="register-name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={isLoading}
                  required
                />

                <FormInput
                  id="register-email"
                  label="Email"
                  type="email"
                  placeholder="student@university.edu"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />

                <FormInput
                  id="register-password"
                  label="Password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />

                <div className="form-group">
                  <label>Register as</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input 
                        type="radio" 
                        value="student" 
                        id="register-student" 
                        name="register-role" 
                        checked={registerRole === 'student'} 
                        onChange={() => setRegisterRole('student')}
                        disabled={isLoading}
                      />
                      <label htmlFor="register-student">Student</label>
                    </div>
                    <div className="radio-item">
                      <input 
                        type="radio" 
                        value="landlord" 
                        id="register-landlord" 
                        name="register-role" 
                        checked={registerRole === 'landlord'} 
                        onChange={() => setRegisterRole('landlord')}
                        disabled={isLoading}
                      />
                      <label htmlFor="register-landlord">Landlord</label>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="button button-primary button-full-width" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}