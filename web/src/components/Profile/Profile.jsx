import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfileLayout, ProfileGrid, ProfileCard, SettingsSection } from './index';
import { Card, CardHeader, CardContent, Alert } from '../UI';
import { uploadImage } from '../../utils/supabaseClient';

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

  const buildFormDataFromUser = (userData, defaultData) => {
    if (!defaultData) {
      return { 
        name: (userData && userData.name) || '', 
        email: (userData && userData. email) || '' 
      };
    }
    
    const result = {};
    const keys = Object.keys(defaultData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (userData && userData[key] !== undefined && userData[key] !== null) {
        result[key] = userData[key];
      } else if (defaultData[key] !== undefined && defaultData[key] !== null) {
        result[key] = defaultData[key];
      } else {
        result[key] = '';
      }
    }
    return result;
  };

  const [formData, setFormData] = useState(function() {
    return buildFormDataFromUser(user, initialFormData);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchProfile();
        if (profileData) {
          setFormData(buildFormDataFromUser(profileData, initialFormData));
          if (profileData.profileImage) {
            setProfileImage(profileData.profileImage);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile.  Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    if (! user) {
      loadProfile();
    } else {
      setFormData(buildFormDataFromUser(user, initialFormData));
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && initialFormData) {
      setFormData(buildFormDataFromUser(user, initialFormData));
    }
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user, initialFormData]);

  const handleInputChange = (field, value) => {
    setFormData(function(prev) {
      return Object.assign({}, prev, { [field]: value });
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Upload to Supabase Storage
      console.log('Uploading image to Supabase...', file.name);
      const { url, error: uploadError } = await uploadImage(file, 'profile-images');
      
      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }

      if (url) {
        console.log('Image uploaded successfully:', url);
        // Update local state immediately for preview
        setProfileImage(url);
        
        // Save to backend
        console.log('Saving profile image URL to backend...');
        await updateProfile({ profileImage: url });
        console.log('Profile updated successfully');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image: ' + (err.message || 'Please try again.'));
    } finally {
      setUploadingImage(false);
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
        <div className={sidebar ?  'profile-sidebar' : ''}>
          <ProfileCard
            user={formData}
            profileImage={profileImage}
            onImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
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
                onClick={function() { setIsEditing(! isEditing); }}
              >
                {isEditing ?  'Cancel' : 'Edit'}
              </button>
            </CardHeader>

            <CardContent>
              {error && <Alert variant="error">{error}</Alert>}
              <form onSubmit={handleSubmit} className="profile-form">
                {typeof formFields === 'function'
                  ? formFields({ formData: formData, handleInputChange: handleInputChange, isEditing: isEditing })
                  : formFields}

                {isEditing && (
                  <div className="profile-form-actions">
                    <button type="submit" className="button button-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={function() { setIsEditing(false); }}
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