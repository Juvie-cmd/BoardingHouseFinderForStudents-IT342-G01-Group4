import { listings } from '../../data/listings';
import { ImageWithFallback } from '../../components/Shared/ImageWithFallback';
import { Dashboard, StatCard, PerformanceList, DataTable } from '../../components/Dashboard';
import { HomeIcon, UsersIcon, MoneyIcon, StarIcon, EyeIcon, MessageIcon, ChartIcon, EditIcon, LocationIcon, PlusIcon, BarChartIcon } from '../../components/Shared/Icons';
import './styles/LandlordDashboard.css';

export function LandlordDashboard({ onCreateListing, onEditListing }) {
  const myListings = listings.slice(0, 3);
  const stats = {
    totalListings: 3,
    activeListings: 2,
    totalInquiries: 24,
    monthlyRevenue: 1350,
    viewsThisMonth: 342,
    averageRating: 4.7,
  };
  const recentInquiries = [
    { id: 1, student: 'John Doe', listing: 'Cozy Student Room', date: '2 hours ago', status: 'New', message: 'Hi, is this still available?' },
    { id: 2, student: 'Jane Smith', listing: 'Campus View Residence', date: '5 hours ago', status: 'Replied', message: 'Can I schedule a viewing?' },
    { id: 3, student: 'Mike Johnson', listing: 'Cozy Student Room', date: '1 day ago', status: 'Scheduled', message: 'Looking forward to the viewing!' },
    { id: 4, student: 'Sarah Williams', listing: 'Campus View Residence', date: '2 days ago', status: 'Replied', message: 'Is WiFi included?' },
  ];

  const getInquiryStatusClass = (status) => {
    if (status === 'New') return 'badge-primary';
    if (status === 'Replied') return 'badge-secondary';
    if (status === 'Scheduled') return 'badge-outline';
    return 'badge-secondary';
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'analytics', label: 'Analytics' },
  ];

  // Performance items for Overview
  const performanceItems = [
    { icon: <EyeIcon size={20} />, label: 'Total Views', value: stats.viewsThisMonth, iconColor: 'blue' },
    { icon: <MessageIcon size={20} />, label: 'Inquiries', value: stats.totalInquiries, iconColor: 'purple' },
    { icon: <ChartIcon size={20} />, label: 'Conversion Rate', value: '7.2%', iconColor: 'green' },
    { icon: <StarIcon size={20} fill="#FFD700" color="#FFD700" />, label: 'Avg Rating', value: stats.averageRating, iconColor: 'yellow' },
  ];

  // Inquiries table columns configuration
  const inquiryColumns = [
    { header: 'Student', field: 'student' },
    { header: 'Listing', field: 'listing' },
    { header: 'Date', field: 'date' },
    {
      header: 'Status',
      field: 'status',
      render: (inquiry) => (
        <span className={`badge ${getInquiryStatusClass(inquiry.status)}`}>{inquiry.status}</span>
      )
    },
    {
      header: 'Actions',
      field: 'actions',
      className: 'text-right',
      render: () => (
        <button className="button button-link button-small">
          <span className="icon"><MessageIcon size={16} /></span> Reply
        </button>
      )
    }
  ];

  // Header Actions
  const headerActions = (
    <button
      className="button button-primary button-large"
      onClick={onCreateListing}
    >
      <span className="icon"><PlusIcon size={20} /></span> Create New Listing
    </button>
  );

  // Render tab content
  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard
                title="Total Listings"
                value={stats.totalListings}
                icon={<HomeIcon size={24} />}
                iconColor="blue"
                description={`${stats.activeListings} active`}
              />
              <StatCard
                title="Total Inquiries"
                value={stats.totalInquiries}
                icon={<MessageIcon size={24} />}
                iconColor="purple"
                description={`${recentInquiries.filter(i => i.status === 'New').length} new`}
              />
              <StatCard
                title="Average Rating"
                value={stats.averageRating}
                icon={<StarIcon size={24} fill="#FFD700" color="#FFD700" />}
                iconColor="yellow"
                description={`${myListings.reduce((sum, l) => sum + (l.reviews || 0), 0)} reviews`}
              />
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Recent Inquiries</h3>
                  <p className="text-muted small-text">Latest messages</p>
                </div>
                <div className="card-content">
                  <div className="inquiries-list">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="inquiry-item">
                        <div className="inquiry-item-header">
                          <div className="inquiry-item-info">
                            <p className="inquiry-student">{inquiry.student}</p>
                            <p className="inquiry-listing">{inquiry.listing}</p>
                          </div>
                          <span className={`badge ${getInquiryStatusClass(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="inquiry-message">{inquiry.message}</p>
                        <p className="inquiry-date">{inquiry.date}</p>
                      </div>
                    ))}
                  </div>
                  <button className="button button-secondary button-full-width inquiry-view-all">
                    View All Messages
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3>Performance Overview</h3>
                  <p className="text-muted small-text">This month</p>
                </div>
                <div className="card-content">
                  <PerformanceList items={performanceItems} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="my-listings-content">
            {myListings.map((listing) => (
              <div key={listing.id} className="card listing-item-card">
                <div className="card-content listing-item-content">
                  <div className="listing-item-image-wrapper">
                    <ImageWithFallback src={listing.image} alt={listing.title} className="listing-item-image" />
                  </div>
                  <div className="listing-item-details">
                    <div className="listing-item-header">
                      <div>
                        <h3>{listing.title}</h3>
                        <div className="listing-item-location">
                          <span className="icon"><LocationIcon size={16} /></span> {listing.location}
                        </div>
                      </div>
                      <span className={`badge ${listing.available ? 'badge-success' : 'badge-secondary'}`}>
                        {listing.available ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    <div className="listing-item-stats">
                      <div>
                        <p className="stat-label">Price</p>
                        <p className="stat-value-main">${listing.price}/mo</p>
                      </div>
                      <div>
                        <p className="stat-label">Room Type</p>
                        <p className="stat-value">{listing.roomType}</p>
                      </div>
                      <div>
                        <p className="stat-label">Rating</p>
                        <p className="stat-value"><span className="icon"><StarIcon size={14} fill="#FFD700" color="#FFD700" /></span>{listing.rating}</p>
                      </div>
                      <div>
                        <p className="stat-label">Reviews</p>
                        <p className="stat-value">{listing.reviews}</p>
                      </div>
                    </div>
                    <div className="listing-item-actions">
                      <button className="button button-secondary button-small" onClick={() => onEditListing(listing.id)}>
                        <span className="icon"><EditIcon size={16} /></span> Edit
                      </button>
                      <button className="button button-secondary button-small">
                        <span className="icon"><EyeIcon size={16} /></span> View
                      </button>
                      <button className="button button-secondary button-small">
                        <span className="icon"><MessageIcon size={16} /></span> Messages
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="add-listing-button-container">
              <button className="button button-primary" onClick={onCreateListing}>
                <span className="icon"><PlusIcon size={20} /></span> Add New Property
              </button>
            </div>
          </div>
        );

      case 'inquiries':
        return (
          <div className="card">
            <div className="card-header">
              <h3>All Inquiries</h3>
              <p className="text-muted small-text">Manage messages</p>
            </div>
            <div className="card-content">
              <DataTable
                columns={inquiryColumns}
                data={recentInquiries}
                className="inquiries-table"
              />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="analytics-content">
            <div className="analytics-stats-grid">
              <div className="card analytics-stat-card">
                <div className="card-header analytics-card-header">
                  <span className="stat-label">Total Views</span>
                  <span className="icon text-muted"><BarChartIcon size={18} /></span>
                </div>
                <div className="card-content">
                  <div className="stat-value-main">{stats.viewsThisMonth}</div>
                  <p className="stat-change positive">+18%</p>
                </div>
              </div>
              <div className="card analytics-stat-card">
                <div className="card-header analytics-card-header">
                  <span className="stat-label">Inquiries Received</span>
                  <span className="icon text-muted"><MessageIcon size={18} /></span>
                </div>
                <div className="card-content">
                  <div className="stat-value-main">{stats.totalInquiries}</div>
                  <p className="stat-change positive">+23%</p>
                </div>
              </div>
              <div className="card analytics-stat-card">
                <div className="card-header analytics-card-header">
                  <span className="stat-label">Occupancy Rate</span>
                  <span className="icon text-muted"><HomeIcon size={18} /></span>
                </div>
                <div className="card-content">
                  <div className="stat-value-main">67%</div>
                  <p className="stat-label">2 of 3 occupied</p>
                </div>
              </div>
            </div>
            <div className="card listing-performance-card">
              <div className="card-header">
                <h3>Performance by Listing</h3>
                <p className="text-muted small-text">Views & inquiries</p>
              </div>
              <div className="card-content">
                <div className="listing-performance-list">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="listing-performance-item">
                      <div className="performance-item-header">
                        <span>{listing.title}</span>
                        <span className="badge badge-warning"><StarIcon size={14} fill="#FFD700" color="#FFD700" /> {listing.rating}</span>
                      </div>
                      <div className="performance-item-stats">
                        <div>
                          <p className="stat-label">Views</p>
                          <p className="stat-value">142</p>
                        </div>
                        <div>
                          <p className="stat-label">Inquiries</p>
                          <p className="stat-value">8</p>
                        </div>
                        <div>
                          <p className="stat-label">Conversion</p>
                          <p className="stat-value">5.6%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
      title="Landlord Dashboard"
      subtitle="Manage your properties and track performance"
      headerActions={headerActions}
      tabs={tabs}
      defaultTab="overview"
      renderTabContent={renderTabContent}
      tabsClassName="dashboard-tabs-list"
    />
  );
}
