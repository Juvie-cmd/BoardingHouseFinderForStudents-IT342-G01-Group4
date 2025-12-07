import React from 'react';
import { Card, CardContent, Badge } from '../UI';
import './styles/ProfileCard.css';

export function ProfileCard({
  user,
  profileImage,
  onImageUpload,
  uploadingImage = false,
  role,
  roleVariant = 'primary',
  additionalInfo,
  variant = ''
}) {
  return (
    <Card className="profile-card">
      <CardContent>
        <div className="profile-image-section">
          <div className={`profile-image-wrapper ${uploadingImage ? 'uploading' : ''}`}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className={`profile-image-placeholder ${variant}`}>
                <span className="profile-initials">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {uploadingImage && (
              <div className="profile-image-uploading-overlay">
                <span className="uploading-spinner"></span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="profile-image-upload"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploadingImage}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="profile-image-upload" 
            className={`button button-secondary button-small ${uploadingImage ? 'disabled' : ''}`}
          >
            {uploadingImage ? 'Uploading...' : 'Change Photo'}
          </label>
        </div>

        <div className="profile-info-section">
          <h2>{user?.name}</h2>
          <p className="profile-role-badge">
            <Badge variant={roleVariant}>{role}</Badge>
          </p>
          <p className="profile-email">{user?.email}</p>
          {additionalInfo}
        </div>
      </CardContent>
    </Card>
  );
}
