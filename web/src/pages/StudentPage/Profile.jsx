import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../components/Profile';
import { FormInput, FormSelect, FormTextarea } from '../../components/UI';
import './styles/Profile.css';

export function StudentProfile() {
  const { user, updateProfile } = useAuth();

  const initialFormData = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    university: user?.university || '',
    yearOfStudy: user?.yearOfStudy || '',
    budget: user?.budget || '',
    preferredLocation: user?.preferredLocation || '',
    roomType: user?.roomType || 'single',
    bio: user?.bio || ''
  };

  const yearOptions = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
    { value: 'Graduate', label: 'Graduate' }
  ];

  const roomTypeOptions = [
    { value: 'single', label: 'Single Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'studio', label: 'Studio' }
  ];

  const settingsItems = [
    {
      title: 'Change Password',
      description: 'Update your password to keep your account secure',
      type: 'button',
      action: { label: 'Change', onClick: () => console.log('Change password') }
    },
    {
      title: 'Email Notifications',
      description: 'Receive updates about new listings and messages',
      type: 'toggle',
      checked: true,
      onChange: (e) => console.log('Toggle notifications:', e.target.checked)
    },
    {
      title: 'Account Privacy',
      description: 'Control who can see your profile information',
      type: 'button',
      action: { label: 'Manage', onClick: () => console.log('Manage privacy') }
    }
  ];

  const formFields = ({ formData, handleInputChange, isEditing }) => (
    <>
      <div className="form-grid-2">
        <FormInput
          id="name"
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={!isEditing}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={!isEditing}
        />
        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+63 XXX XXX XXXX"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          disabled={!isEditing}
        />
        <FormInput
          id="university"
          label="University"
          placeholder="e.g., University of the Philippines"
          value={formData.university}
          onChange={(e) => handleInputChange('university', e.target.value)}
          disabled={!isEditing}
        />
        <FormSelect
          id="yearOfStudy"
          label="Year of Study"
          value={formData.yearOfStudy}
          onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
          options={yearOptions}
          placeholder="Select Year"
          disabled={!isEditing}
        />
        <FormInput
          id="budget"
          label="Monthly Budget"
          type="number"
          placeholder="e.g., 5000"
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', e.target.value)}
          disabled={!isEditing}
        />
        <FormInput
          id="preferredLocation"
          label="Preferred Location"
          placeholder="e.g., Near Campus"
          value={formData.preferredLocation}
          onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
          disabled={!isEditing}
        />
        <FormSelect
          id="roomType"
          label="Preferred Room Type"
          value={formData.roomType}
          onChange={(e) => handleInputChange('roomType', e.target.value)}
          options={roomTypeOptions}
          disabled={!isEditing}
        />
      </div>

      <FormTextarea
        id="bio"
        label="Bio"
        placeholder="Tell us about yourself..."
        value={formData.bio}
        onChange={(e) => handleInputChange('bio', e.target.value)}
        disabled={!isEditing}
      />
    </>
  );

  return (
    <Profile
      role="Student"
      roleVariant="primary"
      headerTitle="My Profile"
      headerSubtitle="Manage your account settings and preferences"
      initialFormData={initialFormData}
      formFields={formFields}
      settingsItems={settingsItems}
      onSubmit={updateProfile} // ✅ Backend integration
    />
  );
}
