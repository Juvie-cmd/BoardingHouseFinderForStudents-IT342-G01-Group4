// src/components/Shared/Header.jsx

// src/components/Shared/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Path depends on your structure
import { HomeIcon } from './Icons';
// 👇 Ensure this path is correct
import './styles/Header.css';

// 👇 Ensure the 'export' keyword is here
export function Header({ favorites = [], onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    // Simulate a short delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    logout();
    navigate('/?logout=success');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // If the user isn't logged in yet, don't render anything (or render a simplified header)
  if (!user) {
    return (
      <header className="main-header">
        <div className="container header-content">
          <div className="header-logo">
            <div className="nav-logo-icon"><HomeIcon size={24} /></div>
            <span>BoardingHouseFinder</span>
          </div>
          {/* Maybe add a Login button here if needed */}
        </div>
      </header>
    );
  }

  // If the user IS logged in, render the full header
  return (
    <header className="main-header">
      <div className="container header-content">
        <div
          className="header-logo"
          onClick={() => onNavigate('home')}
        >
          <div className="nav-logo-icon"><HomeIcon size={24} /></div>
          <span>BoardingHouseFinder</span>
        </div>

        <nav className="header-nav">
          {user?.role === 'student' && (
            <>
              <button
                className="button-link"
                onClick={() => onNavigate('search')}
              >
                Search
              </button>
              <button
                className="button-link"
                onClick={() => onNavigate('profile')}
              >
                Profile
              </button>
            </>
          )}
          {user?.role === 'landlord' && (
            <>
              <button
                className="button-link"
                onClick={() => onNavigate('dashboard')}
              >
                Dashboard
              </button>
              <button
                className="button-link"
                onClick={() => onNavigate('profile')}
              >
                Profile
              </button>
            </>
          )}
           {user?.role === 'admin' && (
            <>
              <button
                className="button-link"
                onClick={() => onNavigate('dashboard')}
              >
                Admin Panel
              </button>
              <button
                className="button-link"
                onClick={() => onNavigate('profile')}
              >
                Profile
              </button>
            </>
          )}

          <div className="header-user-menu">
            <div className="header-user-avatar" onClick={() => onNavigate('profile')}>
              {user.profileImage || user.picture ? (
                <img 
                  src={user.profileImage || user.picture} 
                  alt={user.name} 
                  className="header-avatar-image"
                />
              ) : (
                <span className="header-avatar-initials">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span>Hi, {user.name}</span>
            <button
              className="button button-secondary"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleCancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button
                className="button button-secondary"
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="spinner"></span>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}