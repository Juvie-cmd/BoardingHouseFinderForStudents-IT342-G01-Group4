import { useAuth } from '../../context/AuthContext';
import { Profile, StatsCard } from '../../components/Profile';
import { FormInput, FormTextarea, Badge } from '../../components/UI';
import './styles/Profile.css';

export function LandlordProfile() {
  const { user } = useAuth();

  const initialFormData = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || '',
    taxId: user?.taxId || '',
    bankAccount: user?.bankAccount || '',
    website: user?.website || '',
    bio: user?.bio || '',
    experience: user?.experience || ''
  };

  const stats = {
    totalProperties: 3,
    totalTenants: 7,
    monthlyRevenue: 15000,
    rating: 4.8
  };

  const statsData = [
    { icon: '🏠', label: 'Properties', value: stats.totalProperties, variant: 'green' },
    { icon: '👥', label: 'Total Tenants', value: stats.totalTenants, variant: 'blue' },
    { icon: '💰', label: 'Monthly Revenue', value: `₱${stats.monthlyRevenue.toLocaleString()}`, variant: 'purple' },
    { icon: '⭐', label: 'Average Rating', value: stats.rating, variant: 'yellow' }
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
      description: 'Receive updates about inquiries and bookings',
      type: 'toggle',
      checked: true,
      onChange: (e) => console.log('Toggle email:', e.target.checked)
    },
    {
      title: 'SMS Notifications',
      description: 'Get text messages for urgent matters',
      type: 'toggle',
      checked: false,
      onChange: (e) => console.log('Toggle SMS:', e.target.checked)
    },
    {
      title: 'Verification Status',
      description: 'Verify your identity to build tenant trust',
      type: 'badge',
      badge: <Badge variant="warning">Pending</Badge>
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
          id="website"
          label="Website"
          type="url"
          placeholder="https://example.com"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <hr className="separator" />

      <h4>Business Information</h4>
      <div className="form-grid-2">
        <FormInput
          id="businessName"
          label="Business Name"
          placeholder="e.g., ABC Property Management"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          disabled={!isEditing}
        />

        <FormInput
          id="taxId"
          label="Tax ID / Business Permit"
          placeholder="XXX-XXX-XXX"
          value={formData.taxId}
          onChange={(e) => handleInputChange('taxId', e.target.value)}
          disabled={!isEditing}
        />

        <FormInput
          id="businessAddress"
          label="Business Address"
          placeholder="Complete address"
          value={formData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          disabled={!isEditing}
        />

        <FormInput
          id="bankAccount"
          label="Bank Account"
          placeholder="XXXX-XXXX-XXXX"
          value={formData.bankAccount}
          onChange={(e) => handleInputChange('bankAccount', e.target.value)}
          disabled={!isEditing}
        />

        <FormInput
          id="experience"
          label="Years of Experience"
          type="number"
          placeholder="e.g., 5"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <FormTextarea
        id="bio"
        label="About Your Business"
        placeholder="Tell tenants about your rental business..."
        value={formData.bio}
        onChange={(e) => handleInputChange('bio', e.target.value)}
        disabled={!isEditing}
      />
    </>
  );

  const sidebar = <StatsCard title="Your Statistics" stats={statsData} />;

  return (
    <Profile
      role="Landlord"
      roleVariant="success"
      headerTitle="Landlord Profile"
      headerSubtitle="Manage your business profile and settings"
      initialFormData={initialFormData}
      formFields={formFields}
      settingsItems={settingsItems}
      sidebar={sidebar}
      variant="landlord"
    />
  );
}
