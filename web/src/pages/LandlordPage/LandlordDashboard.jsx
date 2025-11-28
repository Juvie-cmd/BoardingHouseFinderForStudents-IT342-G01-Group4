// src/pages/LandlordPage/LandlordDashboard.jsx
import { useState, useEffect } from 'react';
import API from '../../api/api';
import { ImageWithFallback } from '../../components/Shared/ImageWithFallback';
import { Dashboard, StatCard, PerformanceList, DataTable } from '../../components/Dashboard';
import { HomeIcon, StarIcon, EyeIcon, MessageIcon, ChartIcon, EditIcon, LocationIcon, PlusIcon, BarChartIcon, TrashIcon, CloseIcon } from '../../components/Shared/Icons';
import './styles/LandlordDashboard.css';

export function LandlordDashboard({ onCreateListing, onEditListing }) {
  const [myListings, setMyListings] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Stats placeholder — will compute from data
  const stats = {
    totalListings: myListings.length,
    approvedListings: myListings.filter(l => l.status === 'APPROVED').length,
    pendingListings: myListings.filter(l => l.status === 'PENDING').length,
    rejectedListings: myListings.filter(l => l.status === 'REJECTED').length,
    totalInquiries: recentInquiries.length,
    newInquiries: recentInquiries.filter(i => i.status === 'NEW').length,
    monthlyRevenue: myListings.reduce((sum, l) => sum + (l.price || 0), 0) || 0,
    viewsThisMonth: 0,
    averageRating: myListings.length ? (myListings.reduce((s, l) => s + (l.rating || 0), 0) / myListings.length).toFixed(1) : 0,
  };

  const fetchData = () => {
    console.log("Fetching landlord listings...");
    setLoading(true);
    
    Promise.all([
      API.get("/landlord/listings"),
      API.get("/landlord/inquiries").catch(() => ({ data: [] }))
    ])
      .then(([listRes, inqRes]) => {
        console.log("Listings response:", listRes.data);
        console.log("Inquiries response:", inqRes.data);
        
        // ensure amenities are arrays
        const normalized = (listRes.data || []).map(l => {
          if (typeof l.amenities === 'string') {
            l.amenities = l.amenities ? l.amenities.split(',').map(s => s.trim()) : [];
          }
          return l;
        });
        
        console.log("Normalized listings:", normalized);
        setMyListings(normalized);
        setRecentInquiries(inqRes.data || []);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load landlord data:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to load listings');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete listing functions
  const handleDeleteListing = (listing) => setDeleteConfirm(listing);

  const confirmDeleteListing = () => {
    API.delete(`/landlord/listing/${deleteConfirm.id}`)
      .then(() => {
        setMyListings(myListings.filter(l => l.id !== deleteConfirm.id));
        setDeleteConfirm(null);
        alert('Listing deleted successfully!');
      })
      .catch(err => {
        console.error('Delete listing failed', err);
        alert('Delete failed: ' + (err.response?.data?.message || err.message));
      });
  };

  const cancelDeleteListing = () => setDeleteConfirm(null);

  const getInquiryStatusClass = (status) => {
    if (status === 'NEW') return 'badge-primary';
    if (status === 'REPLIED') return 'badge-secondary';
    if (status === 'SCHEDULED') return 'badge-success';
    if (status === 'CLOSED') return 'badge-outline';
    return 'badge-secondary';
  };

  const getListingStatusClass = (status) => {
    if (status === 'APPROVED') return 'badge-success';
    if (status === 'PENDING') return 'badge-warning';
    if (status === 'REJECTED') return 'badge-danger';
    return 'badge-secondary';
  };

  const getListingStatusLabel = (status) => {
    if (status === 'APPROVED') return 'Approved';
    if (status === 'PENDING') return 'Pending Approval';
    if (status === 'REJECTED') return 'Rejected';
    return status || 'Unknown';
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const performanceItems = [
    { icon: <EyeIcon size={20} />, label: 'Total Views', value: stats.viewsThisMonth, iconColor: 'blue' },
    { icon: <MessageIcon size={20} />, label: 'Inquiries', value: stats.totalInquiries, iconColor: 'purple' },
    { icon: <ChartIcon size={20} />, label: 'Conversion Rate', value: '7.2%', iconColor: 'green' },
    { icon: <StarIcon size={20} fill="#FFD700" color="#FFD700" />, label: 'Avg Rating', value: stats.averageRating, iconColor: 'yellow' },
  ];

  const inquiryColumns = [
    { header: 'Student', field: 'student', render: (i) => i.student?.name || 'Student' },
    { header: 'Listing', field: 'listing', render: (i) => i.listing?.title || 'Listing' },
    { header: 'Type', field: 'type', render: (i) => i.type === 'VISIT_REQUEST' ? 'Visit Request' : 'Message' },
    { header: 'Date', field: 'date', render: (i) => i.dateSent || i.createdAt || '-' },
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

  const headerActions = (
    <button
      className="button button-primary button-large"
      onClick={onCreateListing}
    >
      <span className="icon"><PlusIcon size={20} /></span> Create New Listing
    </button>
  );

  const renderTabContent = (selectedTab) => {
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="alert alert-error">{error}</div>
          <button 
            className="button button-primary" 
            onClick={fetchData}
            style={{ marginTop: '1rem' }}
          >
            Retry
          </button>
        </div>
      );
    }

    switch (selectedTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <StatCard title="Total Listings" value={stats.totalListings} icon={<HomeIcon size={24} />} iconColor="blue" description={`${stats.approvedListings} approved, ${stats.pendingListings} pending, ${stats.rejectedListings} rejected`} />
              <StatCard title="Total Inquiries" value={stats.totalInquiries} icon={<MessageIcon size={24} />} iconColor="purple" description={`${stats.newInquiries} new`} />
              <StatCard title="Average Rating" value={stats.averageRating} icon={<StarIcon size={24} fill="#FFD700" color="#FFD700" />} iconColor="yellow" description={`${myListings.reduce((sum, l) => sum + (l.reviews || 0), 0)} reviews`} />
            </div>

            <div className="recent-activity-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Recent Inquiries</h3>
                  <p className="text-muted small-text">Latest messages and visit requests</p>
                </div>
                <div className="card-content">
                  {recentInquiries.length > 0 ? (
                    <div className="inquiries-list">
                      {recentInquiries.slice(0, 5).map((inquiry) => (
                        <div key={inquiry.id} className="inquiry-item">
                          <div className="inquiry-item-header">
                            <div className="inquiry-item-info">
                              <p className="inquiry-student">{inquiry.student?.name || 'Student'}</p>
                              <p className="inquiry-listing">{inquiry.listing?.title || 'Listing'}</p>
                              <p className="inquiry-type" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {inquiry.type === 'VISIT_REQUEST' ? '📅 Visit Request' : '💬 Message'}
                              </p>
                            </div>
                            <span className={`badge ${getInquiryStatusClass(inquiry.status)}`}>{inquiry.status}</span>
                          </div>
                          <p className="inquiry-message">{inquiry.message || inquiry.notes}</p>
                          {inquiry.type === 'VISIT_REQUEST' && inquiry.visitDate && (
                            <p className="inquiry-visit-info" style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
                              Requested: {inquiry.visitDate} {inquiry.visitTime && `at ${inquiry.visitTime}`}
                            </p>
                          )}
                          <p className="inquiry-date">{inquiry.dateSent || inquiry.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No inquiries yet</p>
                  )}
                  <button className="button button-secondary button-full-width inquiry-view-all">View All Messages</button>
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
            {myListings.length > 0 ? (
              <>
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
                          <span className={`badge ${getListingStatusClass(listing.status)}`}>
                            {getListingStatusLabel(listing.status)}
                          </span>
                        </div>
                        {listing.status === 'REJECTED' && listing.rejectionNotes && (
                          <div className="rejection-notes" style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>
                              ⚠️ Rejection Reason:
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>{listing.rejectionNotes}</p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                              Please edit your listing to address these issues and resubmit for approval.
                            </p>
                          </div>
                        )}
                        {listing.status === 'PENDING' && (
                          <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fef3c7', borderRadius: '4px', fontSize: '0.875rem', color: '#92400e' }}>
                            ⏳ This listing is awaiting admin approval. It will be visible to students once approved.
                          </div>
                        )}
                        <div className="listing-item-stats">
                          <div>
                            <p className="stat-label">Price</p>
                            <p className="stat-value-main">₱{listing.price}/mo</p>
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
                            <span className="icon"><EditIcon size={16} /></span> {listing.status === 'REJECTED' ? 'Edit & Resubmit' : 'Edit'}
                          </button>
                          <button className="button button-secondary button-small">
                            <span className="icon"><EyeIcon size={16} /></span> View
                          </button>
                          <button className="button button-danger button-small" onClick={() => handleDeleteListing(listing)}>
                            <span className="icon"><TrashIcon size={16} /></span> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <h3>No listings yet</h3>
                <p className="text-muted">Create your first listing to get started</p>
                <button 
                  className="button button-primary" 
                  onClick={onCreateListing}
                  style={{ marginTop: '1rem' }}
                >
                  Create Listing
                </button>
              </div>
            )}

            {myListings.length > 0 && (
              <div className="add-listing-button-container">
                <button className="button button-primary" onClick={onCreateListing}>
                  <span className="icon"><PlusIcon size={20} /></span> Add New Property
                </button>
              </div>
            )}
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
              {recentInquiries.length > 0 ? (
                <DataTable columns={inquiryColumns} data={recentInquiries} className="inquiries-table" />
              ) : (
                <p className="text-muted">No inquiries yet</p>
              )}
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
                  <div className="stat-value-main">
                    {myListings.length > 0 
                      ? Math.round((stats.approvedListings / myListings.length) * 100) 
                      : 0}%
                  </div>
                  <p className="stat-label">{stats.approvedListings} of {myListings.length} approved</p>
                </div>
              </div>
            </div>

            {myListings.length > 0 && (
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
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dashboard
        title="Landlord Dashboard"
        subtitle="Manage your properties and track performance"
        headerActions={headerActions}
        tabs={tabs}
        defaultTab="overview"
        renderTabContent={renderTabContent}
        tabsClassName="dashboard-tabs-list"
      />

      {/* Delete Listing Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={cancelDeleteListing}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="button button-link" onClick={cancelDeleteListing}>
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="button button-secondary" onClick={cancelDeleteListing}>Cancel</button>
              <button className="button button-danger" onClick={confirmDeleteListing}>
                <span className="icon"><TrashIcon size={16} /></span> Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}