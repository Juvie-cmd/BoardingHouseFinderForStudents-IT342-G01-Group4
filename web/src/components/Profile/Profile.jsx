import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfileLayout, ProfileGrid, ProfileCard, SettingsSection } from './index';
import { Card, CardHeader, CardContent } from '../UI';

/**
 * Reusable Profile Component
 *
 * This component provides a consistent profile layout for all user roles.
 * Role-specific content is passed via props and children.
 *
 * @param {Object} props
 * @param {string} props.role - User role (e.g., "Student", "Landlord", "Administrator")
 * @param {string} props.roleVariant - Badge color variant (e.g., "primary", "success", "admin")
 * @param {string} props.headerTitle - Profile page title
 * @param {string} props.headerSubtitle - Profile page subtitle
 * @param {Object} props.initialFormData - Initial form data object
 * @param {Function} props.onSubmit - Form submit handler
 * @param {React.ReactNode} props.formFields - Form fields to render (function or component)
 * @param {Array} props.settingsItems - Array of settings items
 * @param {React.ReactNode} props.sidebar - Additional sidebar content (stats, activities, etc.)
 * @param {string} props.variant - Profile card variant
 * @param {React.ReactNode} props.additionalInfo - Additional info to display in profile card
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
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialFormData || {
    name: user?.name || '',
    email: user?.email || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Profile updated:', formData);
    }
    setIsEditing(false);
  };

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
