import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, FormInput, Alert } from '../../components/UI';
import './styles/LoginPage.css';

export function LoginPage() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams(); 

  // Determine initial tab based on URL param, default to 'login'
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab); 

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('student');

  // Validation errors and success messages
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // 👇 3. Use useEffect to potentially switch tab if URL changes after load (optional but good practice)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const logoutParam = searchParams.get('logout');

    if (tabParam === 'register' && activeTab !== 'register') {
      setActiveTab('register');
    } else if (tabParam !== 'register' && activeTab !== 'login') {
       setActiveTab('login'); // Default back to login if param is missing/invalid
    }

    // Check for logout success message
    if (logoutParam === 'success') {
      setLoginSuccess('You have been successfully logged out!');
      // Clear the message after 5 seconds
      setTimeout(() => {
        setLoginSuccess('');
      }, 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Re-run only if searchParams changes


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess(''); // Clear success message when attempting login

    // Validation
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

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      // Navigation happens automatically via PublicRoute
    } catch(err) {
      console.error("Login failed:", err);
      setLoginError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false); // Stop loading on error
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    // Validation
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

    setIsLoading(true);
    try {
      const result = await register(registerName, registerEmail, registerPassword, registerRole);

      // Show success message
      setRegisterSuccess(result.message || 'Account created successfully!');

      // Clear form fields
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('student');

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setActiveTab('login');
        setLoginError(''); // Clear any login errors
        setRegisterSuccess('');
        // Show success message on login tab
        setLoginSuccess('Account created successfully! Please login with your credentials.');

        // Clear the login success message after 5 seconds
        setTimeout(() => {
          setLoginSuccess('');
        }, 5000);
      }, 2000);

      setIsLoading(false);
    } catch(err) {
      console.error("Registration failed:", err);
      setRegisterError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo">
            <span role="img" aria-label="home">🏠</span>
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
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`login-tab-trigger ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
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

                {/* Admin Login Info */}
                <Alert variant="info">
                  <strong>Admin Login:</strong>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Email: admin@boardinghouse.com<br />
                    Password: admin123 <br/><br />
                    <b>note:</b> this is for admin login purposes, it will be deleted in the final
                  </div>
                </Alert>

                <FormInput
                  id="login-email"
                  label="Email"
                  type="email"
                  placeholder="student@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <FormInput
                  id="login-password"
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />

                <button type="submit" className="button button-primary button-full-width" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
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

                <FormInput
                  id="register-name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />

                <FormInput
                  id="register-email"
                  label="Email"
                  type="email"
                  placeholder="student@university.edu"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />

                <FormInput
                  id="register-password"
                  label="Password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />

                <div className="form-group">
                  <label>Register as</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input type="radio" value="student" id="register-student" name="register-role" checked={registerRole === 'student'} onChange={() => setRegisterRole('student')} />
                      <label htmlFor="register-student">Student</label>
                    </div>
                    <div className="radio-item">
                      <input type="radio" value="landlord" id="register-landlord" name="register-role" checked={registerRole === 'landlord'} onChange={() => setRegisterRole('landlord')} />
                      <label htmlFor="register-landlord">Landlord</label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="button button-primary button-full-width" disabled={isLoading}>
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