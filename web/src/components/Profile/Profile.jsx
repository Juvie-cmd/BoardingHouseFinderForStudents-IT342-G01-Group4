import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfileLayout, ProfileGrid, ProfileCard, SettingsSection } from './index';
import { Card, CardHeader, CardContent, Alert } from '../UI';

/**
 * Reusable Profile Component with backend integration
 */
export function Profile({
  role,
  roleVariant,
  headerTitle,
  headerSubtitle,
  initialFormData,
  onSubmit,
  formFields,
  settingsItems,
  sidebar,
  variant,
  additionalInfo,
  layoutVariant
}) {
  const { user, fetchProfile, updateProfile } = useAuth();

  const [formData, setFormData] = useState(initialFormData || {
    name: user?.name || '',
    email: user?.email || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        await fetchProfile(); // updates context user
        setFormData({
          name: user?.name || '',
          email: user?.email || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await updateProfile(formData);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update failed:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <ProfileLayout
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      variant={layoutVariant}
    >
      <ProfileGrid>
        <div className={sidebar ? 'profile-sidebar' : ''}>
          <ProfileCard
            user={formData}
            profileImage={profileImage}
            onImageUpload={handleImageUpload}
            role={role}
            roleVariant={roleVariant}
            variant={variant}
            additionalInfo={additionalInfo}
          />

          {sidebar}
        </div>

        <div className={sidebar ? 'profile-main' : ''}>
          <Card className="profile-details-card">
            <CardHeader>
              <h3>Profile Information</h3>
              <button
                className="button button-link"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </CardHeader>
            <CardContent>
              {error && <Alert variant="error">{error}</Alert>}
              <form onSubmit={handleSubmit} className="profile-form">
                {typeof formFields === 'function'
                  ? formFields({ formData, handleInputChange, isEditing })
                  : formFields
                }

                {isEditing && (
                  <div className="profile-form-actions">
                    <button type="submit" className="button button-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {settingsItems && (
            <SettingsSection
              title={role === 'Administrator' ? 'Security & Settings' : 'Account Settings'}
              items={settingsItems}
            />
          )}
        </div>
      </ProfileGrid>
    </ProfileLayout>
  );
}
