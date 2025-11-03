import React from 'react';

export function StatCard({ title, value, icon, iconColor = 'blue', description, descriptionClass = '', subtext }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon ${iconColor}`}>{icon}</div>
      </div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        {description && (
          <p className={`stat-card-desc ${descriptionClass}`}>{description}</p>
        )}
        {subtext && <div className="stat-card-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
