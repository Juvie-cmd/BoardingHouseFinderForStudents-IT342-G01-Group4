import React from 'react';

export function TabNavigation({ tabs, selectedTab, onTabChange, className = '' }) {
  return (
    <div className={`dashboard-tabs-list ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`dashboard-tab-trigger ${selectedTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badge && (
            <span className={`badge ${tab.badgeClass || 'badge-danger'} badge-small`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
