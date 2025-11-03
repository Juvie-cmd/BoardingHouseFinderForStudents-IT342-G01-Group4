import React from 'react';
import { Card, CardHeader, CardContent, ToggleSwitch } from '../UI';
import './styles/SettingsSection.css';

export function SettingsSection({ title = 'Account Settings', items = [] }) {
  return (
    <Card className="profile-settings-card">
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="settings-list">
          {items.map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsItem({ title, description, action, type = 'button', checked, onChange, badge }) {
  return (
    <div className="settings-item">
      <div className="settings-item-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      {type === 'button' && action && (
        <button className="button button-secondary button-small" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {type === 'toggle' && (
        <ToggleSwitch checked={checked} onChange={onChange} />
      )}
      {type === 'badge' && badge}
    </div>
  );
}
