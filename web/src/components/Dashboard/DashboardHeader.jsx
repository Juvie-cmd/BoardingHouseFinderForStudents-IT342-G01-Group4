import React from 'react';

export function DashboardHeader({ title, subtitle, actions }) {
  return (
    <div className="dashboard-header-bar">
      <div className="container dashboard-header-content">
        <div className="dashboard-header-title">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="dashboard-header-actions">{actions}</div>}
      </div>
    </div>
  );
}
