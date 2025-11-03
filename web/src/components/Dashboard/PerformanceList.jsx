import React from 'react';

export function PerformanceList({ items }) {
  return (
    <div className="performance-list">
      {items.map((item, index) => (
        <div key={index} className="performance-item">
          <div className="performance-info">
            <div className={`stat-card-icon ${item.iconColor || 'blue'}`}>{item.icon}</div>
            <span>{item.label}</span>
          </div>
          <span className={`performance-value ${item.valueClass || ''}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
