// src/pages/AdminPage/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import API from '../../api/api';
import { Dashboard, StatCard, PerformanceList, DataTable } from '../../components/Dashboard';
import { UsersIcon, HomeIcon, CheckIcon, LocationIcon, StarIcon, CloseIcon, SearchIcon, GraduationIcon, BuildingIcon, EditIcon, TrashIcon } from '../../components/Shared/Icons';
import './styles/AdminDashboard.css';

const ImageWithFallback = ({ src, alt, className }) => {
  const fallbackSrc = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
  const isInvalidSrc = ! src || src.startsWith('blob:') || src === '';
  
  return (
    <img 
      src={isInvalidSrc ? fallbackSrc : src} 
      alt={alt} 
      className={className}
      onError={(e) => { e.target.src = fallbackSrc; }}
    />
  );
};

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteListingConfirm, setDeleteListingConfirm] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', active: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const fetchData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      API.get('/admin/users'),
      API.get('/admin/listings')
    ])
      .then(([usersRes, listingsRes]) => {
        console.log('Users loaded:', usersRes. data);
        console.log('Listings loaded:', listingsRes.data);
        setUsers(usersRes.data || []);
        
        const normalized = (listingsRes.data || []).map(l => {
          if (typeof l. amenities === 'string') {
            l.amenities = l.amenities ?  l.amenities. split(','). map(s => s.trim()) : [];
          }
          return l;
        });
        setListings(normalized);
      })
      .catch((err) => {
        console.error('Failed to load admin data', err);
        setError('Failed to load data.  Make sure you are logged in as admin.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    totalUsers: users.length,
    totalStudents: users.filter(u => u. role && u.role.toLowerCase() === 'student').length,
    totalLandlords: users.filter(u => u.role && u.role. toLowerCase() === 'landlord').length,
    totalListings: listings.length,
    activeListings: listings. filter(l => l.available).length,
    pendingListings: listings.filter(l => !l.available).length,
  };

  // User management functions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user. active !== false
    });
  };

  const handleSaveEdit = () => {
    API.put(`/admin/user/${editingUser. id}`, editForm)
      .then(res => {
        setUsers(users.map(u => u.id === editingUser. id ? res.data : u));
        setEditingUser(null);
        setEditForm({ name: '', email: '', role: '', active: true });
        alert('User updated successfully! ');
      })
      .catch(err => {
        console.error('Failed to save user', err);
        alert('Failed to save user: ' + (err.response?.data?.message || err.message));
      });
  };

  const handleDeleteUser = (user) => setDeleteConfirm(user);
  
  const confirmDeleteUser = () => {
    API.delete(`/admin/user/${deleteConfirm.id}`)
      .then(() => {
        setUsers(users. filter(u => u.id !== deleteConfirm.id));
        setDeleteConfirm(null);
        alert('User deleted successfully!');
      })
      . catch(err => {
        console.error('Delete failed', err);
        alert('Delete failed: ' + (err.response?.data?.message || err. message));
      });
  };
  
  const cancelDeleteUser = () => setDeleteConfirm(null);

  // Listing management functions
  const approveListing = (id) => {
    API.put(`/admin/listing/${id}/approve`)
      .then(() => {
        setListings(listings. map(l => l.id === id ?  { ...l, available: true } : l));
        alert('Listing approved successfully! ');
      })
      .catch(err => {
        console.error('Approve failed', err);
        alert('Approve failed: ' + (err.response?.data?.message || err. message));
      });
  };

  const rejectListing = (id) => {
    API. put(`/admin/listing/${id}/reject`)
      .then(() => {
        setListings(listings.map(l => l.id === id ? { ...l, available: false } : l));
        alert('Listing rejected successfully!');
      })
      .catch(err => {
        console.error('Reject failed', err);
        alert('Reject failed: ' + (err.response?. data?.message || err.message));
      });
  };

  const handleDeleteListing = (listing) => setDeleteListingConfirm(listing);
  
  const confirmDeleteListing = () => {
    API.delete(`/admin/listing/${deleteListingConfirm. id}`)
      .then(() => {
        setListings(listings.filter(l => l.id !== deleteListingConfirm.id));
        setDeleteListingConfirm(null);
        alert('Listing deleted successfully!');
      })
      .catch(err => {
        console.error('Delete listing failed', err);
        alert('Delete failed: ' + (err.response?.data?. message || err.message));
      });
  };
  
  const cancelDeleteListing = () => setDeleteListingConfirm(null);

  const getUserStatusClass = (status) => status === 'Active' ? 'badge-success' : 'badge-danger';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
  ];

  const performanceItems = [
    { icon: <HomeIcon size={20} />, label: 'Active Listings', value: stats.activeListings, iconColor: 'green' },
    { icon: <CloseIcon size={20} />, label: 'Pending/Rejected', value: stats.pendingListings, iconColor: 'red' },
    { icon: <GraduationIcon size={20} />, label: 'Students', value: stats. totalStudents, iconColor: 'blue' },
    { icon: <BuildingIcon size={20} />, label: 'Landlords', value: stats.totalLandlords, iconColor: 'purple' },
  ];

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
          {user.role?. toLowerCase() === 'student' ?  <GraduationIcon size={14} /> : <BuildingIcon size={14} />} {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      render: (user) => (
        <span className={`badge ${getUserStatusClass(user.active ?  'Active' : 'Suspended')}`}>
          {user.active ?  'Active' : 'Suspended'}
        </span>
      )
    },
    {
      header: 'Join Date',
      field: 'joinDate',
      render: (user) => user.joinDate || 'N/A'
    },
    {
      header: 'Actions',
      field: 'actions',
      render: (user) => (
        <div className="user-actions">
          <button className="button button-success button-small" onClick={() => handleEditUser(user)}>
            <span className="icon"><EditIcon size={16} /></span> Edit
          </button>
          <button className="button button-danger button-small" onClick={() => handleDeleteUser(user)}>
            <span className="icon"><TrashIcon size={16} /></span> Delete
          </button>
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(user => {
    if (! searchQuery. trim()) return true;
    const query = searchQuery.toLowerCase();
    return user.name?. toLowerCase().includes(query) || 
           user.email?.toLowerCase().includes(query) || 
           (user.role || '').toLowerCase().includes(query);
  });

  return (
    <>
      <Dashboard
        title="Admin Dashboard"
        subtitle="Manage platform users, listings, and monitor activity"
        tabs={tabs}
        defaultTab="overview"
        renderTabContent={(tab) => {
          if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
          
          if (error) return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="alert alert-error">{error}</div>
              <button className="button button-primary" onClick={fetchData} style={{ marginTop: '1rem' }}>
                Retry
              </button>
            </div>
          );

          switch (tab) {
            case 'overview':
              return (
                <div className="overview-content">
                  <div className="stats-grid">
                    <StatCard 
                      title="Total Users" 
                      value={stats.totalUsers} 
                      icon={<UsersIcon size={24} />} 
                      iconColor="blue" 
                      description={`${stats.totalStudents} students, ${stats.totalLandlords} landlords`}
                    />
                    <StatCard 
                      title="Total Listings" 
                      value={stats.totalListings} 
                      icon={<HomeIcon size={24} />} 
                      iconColor="green" 
                      description={`${stats.activeListings} active, ${stats. pendingListings} pending`}
                    />
                    <StatCard 
                      title="Active Listings" 
                      value={stats.activeListings} 
                      icon={<CheckIcon size={24} />} 
                      iconColor="purple" 
                      description="Approved and visible"
                    />
                  </div>

                  <div className="recent-activity-grid">
                    <div className="card">
                      <div className="card-header">
                        <h3>Platform Statistics</h3>
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
                <>
                  <div className="card">
                    <div className="card-header user-management-header">
                      <div>
                        <h3>User Management</h3>
                        <p className="text-muted small-text">
                          {searchQuery. trim() 
                            ? `Showing ${filteredUsers. length} of ${users.length} users` 
                            : `${users.length} total users`}
                        </p>
                      </div>
                      <div className="search-input-wrapper">
                        <span className="icon"><SearchIcon size={18} /></span>
                        <input 
                          type="text" 
                          placeholder="Search by name, email, or role..." 
                          value={searchQuery} 
                          onChange={(e) => setSearchQuery(e. target.value)} 
                          className="input input-with-icon" 
                        />
                      </div>
                    </div>
                    <div className="card-content">
                      {filteredUsers.length > 0 ?  (
                        <DataTable columns={userColumns} data={filteredUsers} className="users-table" />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          <p>{searchQuery ?  `No users found matching "${searchQuery}"` : 'No users found'}</p>
                          {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="button button-secondary" style={{ marginTop: '1rem' }}>
                              Clear Search
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit User Modal */}
                  {editingUser && (
                    <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                          <h3>Edit User</h3>
                          <button className="button button-link" onClick={() => setEditingUser(null)}>
                            <CloseIcon size={20} />
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>Full Name</label>
                            <input 
                              value={editForm.name} 
                              onChange={(e) => setEditForm({ ...editForm, name: e.target. value })} 
                              className="input" 
                            />
                          </div>
                          <div className="form-group">
                            <label>Email</label>
                            <input 
                              value={editForm.email} 
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                              className="input" 
                            />
                          </div>
                          <div className="form-group">
                            <label>Role</label>
                            <select 
                              value={editForm.role} 
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} 
                              className="select"
                            >
                              <option value="Student">Student</option>
                              <option value="Landlord">Landlord</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Status</label>
                            <select 
                              value={editForm.active ?  'Active' : 'Suspended'} 
                              onChange={(e) => setEditForm({ ... editForm, active: e.target.value === 'Active' })} 
                              className="select"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </div>
                        </div>
                        <div className="modal-actions">
                          <button className="button button-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                          <button className="button button-primary" onClick={handleSaveEdit}>Save Changes</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete User Confirmation Modal */}
                  {deleteConfirm && (
                    <div className="modal-overlay" onClick={cancelDeleteUser}>
                      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><h3>Confirm Delete</h3></div>
                        <div className="modal-body">
                          <p>Are you sure you want to delete user <strong>{deleteConfirm.name}</strong>?</p>
                          <p className="text-muted" style={{ marginTop: '0.5rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-actions">
                          <button className="button button-secondary" onClick={cancelDeleteUser}>Cancel</button>
                          <button className="button button-danger" onClick={confirmDeleteUser}>
                            <span className="icon"><TrashIcon size={16} /></span> Delete User
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );

            case 'listings':
              return (
                <>
                  <div className="card">
                    <div className="card-header">
                      <h3>Listings Management</h3>
                      <p className="text-muted small-text">
                        {listings.length} total listings • {stats.activeListings} active • {stats.pendingListings} pending/rejected
                      </p>
                    </div>
                    <div className="card-content">
                      {listings.length > 0 ? (
                        <div className="admin-listings-list">
                          {listings.map((listing) => (
                            <div key={listing.id} className="admin-listing-item">
                              <div className="admin-listing-image-wrapper">
                                <ImageWithFallback src={listing.image} alt={listing.title} className="admin-listing-image" />
                              </div>
                              <div className="admin-listing-details">
                                <div className="admin-listing-header">
                                  <div>
                                    <h3>{listing.title}</h3>
                                    <p className="admin-listing-location">
                                      <span className="icon"><LocationIcon size={16} /></span>
                                      {listing.location}
                                    </p>
                                  </div>
                                  <span className={`badge ${listing.available ? 'badge-success' : 'badge-warning'}`}>
                                    {listing. available ? 'Active' : 'Pending/Rejected'}
                                  </span>
                                </div>
                                <div className="admin-listing-info">
                                  <span className="listing-price-admin">₱{listing.price}/mo</span>
                                  <span>•</span>
                                  <span className="listing-rating-admin">
                                    <StarIcon size={14} fill="#FFD700" color="#FFD700" /> {listing.rating || 0}
                                  </span>
                                  <span>•</span>
                                  <span>{listing.reviews || 0} reviews</span>
                                  <span>•</span>
                                  <span>{listing.roomType || 'N/A'}</span>
                                </div>
                                {/* ALL BUTTONS ALWAYS VISIBLE AND FUNCTIONAL */}
                                <div className="admin-listing-actions">
                                  <button 
                                    className="button button-primary button-small" 
                                    onClick={() => approveListing(listing.id)}
                                  >
                                    <span className="icon"><CheckIcon size={16} /></span> Approve
                                  </button>
                                  <button 
                                    className="button button-warning button-small" 
                                    onClick={() => rejectListing(listing.id)}
                                  >
                                    <span className="icon"><CloseIcon size={16} /></span> Reject
                                  </button>
                                  <button 
                                    className="button button-danger button-small" 
                                    onClick={() => handleDeleteListing(listing)}
                                  >
                                    <span className="icon"><TrashIcon size={16} /></span> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          <p>No listings found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Listing Confirmation Modal */}
                  {deleteListingConfirm && (
                    <div className="modal-overlay" onClick={cancelDeleteListing}>
                      <div className="modal-content" onClick={(e) => e. stopPropagation()}>
                        <div className="modal-header"><h3>Confirm Delete Listing</h3></div>
                        <div className="modal-body">
                          <p>Are you sure you want to delete listing <strong>{deleteListingConfirm.title}</strong>? </p>
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

            default:
              return null;
          }
        }}
        className="admin-dashboard-page"
        contentClassName="admin-main-content"
        tabsClassName="admin-tabs-list"
      />
    </>
  );
}