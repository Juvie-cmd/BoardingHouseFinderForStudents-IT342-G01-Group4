import { useState } from 'react';
import { listings } from '../../data/listings';
import { Dashboard, StatCard, PerformanceList, DataTable } from '../../components/Dashboard';
import './styles/AdminDashboard.css';

// Mock Image component
const ImageWithFallback = ({ src, alt, className }) => <img src={src} alt={alt} className={className} />;

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const stats = {
    totalUsers: 1247, totalStudents: 956, totalLandlords: 289,
    totalListings: listings.length, activeListings: listings.filter(l => l.available).length,
    totalInquiries: 342, pendingReports: 5, platformRevenue: 15420,
    newUsersThisMonth: 89, newListingsThisMonth: 12,
  };
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', joinDate: '2024-10-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Landlord', status: 'Active', joinDate: '2024-10-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', status: 'Active', joinDate: '2024-10-05' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Landlord', status: 'Suspended', joinDate: '2024-09-20' },
  ];
  const mockReports = [
    { id: 1, type: 'Listing', title: 'Inappropriate content', reportedBy: 'John Doe', status: 'Pending', date: '2024-10-18', severity: 'High' },
    { id: 2, type: 'User', title: 'Spam messages', reportedBy: 'Jane Smith', status: 'Pending', date: '2024-10-17', severity: 'Medium' },
    { id: 3, type: 'Listing', title: 'Misleading pricing', reportedBy: 'Mike Johnson', status: 'Resolved', date: '2024-10-15', severity: 'Low' },
  ];

  // Helper functions for badge classes
  const getUserStatusClass = (status) => status === 'Active' ? 'badge-success' : 'badge-danger';
  const getReportStatusClass = (status) => status === 'Pending' ? 'badge-danger' : 'badge-secondary';
  const getReportSeverityClass = (severity) => {
    if (severity === 'High') return 'badge-danger';
    if (severity === 'Medium') return 'badge-warning';
    return 'badge-secondary';
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
    { id: 'reports', label: 'Reports', badge: stats.pendingReports > 0 ? stats.pendingReports : null },
  ];

  // Performance items for Quick Stats
  const performanceItems = [
    { icon: '💬', label: 'Total Inquiries', value: stats.totalInquiries, iconColor: 'purple' },
    { icon: '📈', label: 'Conversion Rate', value: '6.8%', iconColor: 'green' },
    { icon: '✔️', label: 'Verified Listings', value: Math.round(stats.totalListings * 0.85), iconColor: 'blue' },
    { icon: '👥', label: 'Active Users Today', value: '128', iconColor: 'yellow' },
  ];

  // User table columns configuration
  const userColumns = [
    {
      header: 'User',
      field: 'user',
      render: (user) => (
        <div>
          <p className="user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
        </div>
      )
    },
    {
      header: 'Role',
      field: 'role',
      render: (user) => (
        <span className="badge badge-outline">
          {user.role === 'Student' ? '🎓' : '🏢'} {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      render: (user) => (
        <span className={`badge ${getUserStatusClass(user.status)}`}>{user.status}</span>
      )
    },
    {
      header: 'Join Date',
      field: 'joinDate'
    },
    {
      header: 'Actions',
      field: 'actions',
      render: () => (
        <div className="user-actions">
          <button className="button button-success button-small">Edit</button>
          <button className="button button-danger button-small">Delete</button>
        </div>
      )
    }
  ];

  // Render tab content
  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                iconColor="blue"
                description={`+${stats.newUsersThisMonth} this month`}
                descriptionClass="positive"
                subtext={
                  <>
                    <span>{stats.totalStudents} students</span> • <span>{stats.totalLandlords} landlords</span>
                  </>
                }
              />
              <StatCard
                title="Total Listings"
                value={stats.totalListings}
                icon="🏠"
                iconColor="green"
                description={`+${stats.newListingsThisMonth} this month`}
                descriptionClass="positive"
                subtext={<span>{stats.activeListings} active</span>}
              />
              <StatCard
                title="Pending Reports"
                value={stats.pendingReports}
                icon="⚠️"
                iconColor="red"
                description="Requires attention"
                descriptionClass="negative"
              />
            </div>

            {/* Platform Health & Activity */}
            <div className="recent-activity-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Quick Stats</h3>
                  <p className="text-muted small-text">At a glance</p>
                </div>
                <div className="card-content">
                  <PerformanceList items={performanceItems} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="card">
            <div className="card-header user-management-header">
              <div>
                <h3>User Management</h3>
                <p className="text-muted small-text">View and manage users</p>
              </div>
              <div className="search-input-wrapper">
                <span className="icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-with-icon"
                />
              </div>
            </div>
            <div className="card-content">
              <DataTable
                columns={userColumns}
                data={mockUsers}
                className="users-table"
              />
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="card">
            <div className="card-header">
              <h3>Listings Management</h3>
              <p className="text-muted small-text">Review and moderate listings</p>
            </div>
            <div className="card-content">
              <div className="admin-listings-list">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="admin-listing-item">
                    <div className="admin-listing-image-wrapper">
                      <ImageWithFallback src={listing.image} alt={listing.title} className="admin-listing-image" />
                    </div>
                    <div className="admin-listing-details">
                      <div className="admin-listing-header">
                        <div>
                          <h3>{listing.title}</h3>
                          <p className="admin-listing-location">
                            <span className="icon">📍</span>{listing.location}
                          </p>
                        </div>
                        <span className={`badge ${listing.available ? 'badge-success' : 'badge-secondary'}`}>
                          {listing.available ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="admin-listing-info">
                        <span className="listing-price-admin">${listing.price}/mo</span>•
                        <span className="listing-rating-admin">⭐ {listing.rating}</span>•
                        <span>{listing.reviews} reviews</span>
                      </div>
                      <div className="admin-listing-actions">
                        <button className="button button-secondary button-small">
                          <span className="icon">👁️</span> View
                        </button>
                        <button className="button button-primary button-small">
                          <span className="icon">✔️</span> Approve
                        </button>
                        <button className="button button-danger-outline button-small">
                          <span className="icon">❌</span> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="card">
            <div className="card-header">
              <h3>Reports & Moderation</h3>
              <p className="text-muted small-text">Review user reports</p>
            </div>
            <div className="card-content">
              <div className="reports-list">
                {mockReports.map((report) => (
                  <div key={report.id} className="report-item">
                    <div className="report-item-header">
                      <div className="report-badges">
                        <span className="badge badge-outline">{report.type}</span>
                        <span className={`badge ${getReportSeverityClass(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className={`badge ${getReportStatusClass(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <h4 className="report-title">{report.title}</h4>
                    <div className="report-details">
                      <p>Reported by: <span className="report-detail-value">{report.reportedBy}</span></p>
                      <p>{report.date}</p>
                    </div>
                    <div className="report-actions">
                      <button className="button button-primary button-small">View Details</button>
                      {report.status === 'Pending' && (
                        <>
                          <button className="button button-success-outline button-small">
                            <span className="icon">✔️</span> Resolve
                          </button>
                          <button className="button button-secondary button-small">
                            <span className="icon">❌</span> Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dashboard
      title="Admin Dashboard"
      subtitle="Manage platform users, listings, and monitor activity"
      tabs={tabs}
      defaultTab="overview"
      renderTabContent={renderTabContent}
      className="admin-dashboard-page"
      contentClassName="admin-main-content"
      tabsClassName="admin-tabs-list"
    />
  );
}
