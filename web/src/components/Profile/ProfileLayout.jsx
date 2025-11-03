import React from 'react';
import './styles/ProfileLayout.css';

export function ProfileLayout({ children, headerTitle, headerSubtitle, variant = '' }) {
  return (
    <div className="profile-page page-container">
      <div className={`profile-header-bar ${variant}`}>
        <div className="container profile-header-content">
          <div className="profile-header-main">
            <div>
              <h1>{headerTitle}</h1>
              {headerSubtitle && <p className="text-muted">{headerSubtitle}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-main-content">
        {children}
      </div>
    </div>
  );
}

export function ProfileGrid({ children, sidebar, main }) {
  if (children) {
    return <div className="profile-grid">{children}</div>;
  }

  return (
    <div className="profile-grid">
      {sidebar && <div className="profile-sidebar">{sidebar}</div>}
      {main && <div className="profile-main">{main}</div>}
    </div>
  );
}
