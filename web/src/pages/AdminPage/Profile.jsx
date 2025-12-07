import { useAuth } from '../../context/AuthContext';
import { Profile, StatsCard, ActivityCard } from '../../components/Profile';
import { FormInput, FormSelect, FormTextarea, useToast } from '../../components/UI';
import { UsersIcon, HomeIcon, WarningIcon, CheckIcon } from '../../components/Shared/Icons';
import './styles/Profile.css';

export function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const initialFormData = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    employeeId: user?.employeeId || '',
    bio: user?.bio || ''
  };

  const adminStats = {
    totalUsers: 1245,
    totalListings: 342,
    activeReports: 12,
    resolvedReports: 156
  };

  const recentActivity = [
    { id: 1, action: 'Verified new landlord', user: 'John Property Manager', time: '2 hours ago' },
    { id: 2, action: 'Resolved report', user: 'Report #156', time: '5 hours ago' },
    { id: 3, action: 'Approved listing', user: 'Cozy Student Room', time: '1 day ago' },
    { id: 4, action: 'Suspended user', user: 'user@example.com', time: '2 days ago' }
  ];

  const statsData = [
    { icon: <UsersIcon size={20} />, label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), variant: 'blue' },
    { icon: <HomeIcon size={20} />, label: 'Total Listings', value: adminStats.totalListings, variant: 'green' },
    { icon: <WarningIcon size={20} />, label: 'Active Reports', value: adminStats.activeReports, variant: 'red' },
    { icon: <CheckIcon size={20} />, label: 'Resolved', value: adminStats.resolvedReports, variant: 'purple' }
  ];

  const departmentOptions = [
    { value: 'operations', label: 'Operations' },
    { value: 'support', label: 'Customer Support' },
    { value: 'moderation', label: 'Content Moderation' },
    { value: 'technical', label: 'Technical' }
  ];

  const settingsItems = [
    {
      title: 'Change Password',
      description: 'Admin password is managed by the system',
      type: 'button',
      action: { label: 'Change', onClick: () => toast.error('Password changes for Administrator accounts are restricted for security reasons.') }
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      type: 'toggle',
      checked: true,
      disabled: true
    },
    {
      title: 'Login Alerts',
      description: 'Get notified of new login attempts',
      type: 'toggle',
      checked: true,
      disabled: true
    },
    {
      title: 'Admin Activity Log',
      description: 'View detailed logs of your administrative actions',
      type: 'button',
      action: { label: 'View Logs' },
      disabled: true
    },
    {
      title: 'System Notifications',
      description: 'Receive alerts for critical system events',
      type: 'toggle',
      checked: true,
      disabled: true
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
          id="employeeId"
          label="Employee ID"
          placeholder="ADMIN-XXX"
          value={formData.employeeId}
          onChange={(e) => handleInputChange('employeeId', e.target.value)}
          disabled={!isEditing}
        />

        <FormSelect
          id="department"
          label="Department"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          options={departmentOptions}
          placeholder="Select Department"
          disabled={!isEditing}
        />
      </div>

      <FormTextarea
        id="bio"
        label="About"
        placeholder="Brief description about your role..."
        value={formData.bio}
        onChange={(e) => handleInputChange('bio', e.target.value)}
        disabled={!isEditing}
      />
    </>
  );

  const additionalInfo = ({ formData }) =>
    formData.employeeId ? (
      <p className="profile-employee-id">ID: {formData.employeeId}</p>
    ) : null;

  const sidebar = (
    <>
      <StatsCard title="Platform Statistics" stats={statsData} />
      <ActivityCard title="Recent Activity" activities={recentActivity} />
    </>
  );

  return (
    <Profile
      role="Administrator"
      roleVariant="admin"
      headerTitle="Administrator Profile"
      headerSubtitle="System administration and management"
      initialFormData={initialFormData}
      formFields={formFields}
      settingsItems={settingsItems}
      sidebar={sidebar}
      variant="admin"
      layoutVariant="admin"
      additionalInfo={additionalInfo}
      onSubmit={updateProfile} // ✅ Backend integration
    />
  );
}
