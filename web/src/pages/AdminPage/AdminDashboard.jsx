// src/pages/AdminPage/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import API from '../../api/api';
import { listings as mockListings } from '../../data/listings'; // fallback if backend fails
import { Dashboard, StatCard, PerformanceList, DataTable } from '../../components/Dashboard';
import { UsersIcon, HomeIcon, WarningIcon, CheckIcon, MessageIcon, ChartIcon, LocationIcon, StarIcon, EyeIcon, CloseIcon, SearchIcon, GraduationIcon, BuildingIcon, EditIcon, TrashIcon } from '../../components/Shared/Icons';
import './styles/AdminDashboard.css';

const ImageWithFallback = ({ src, alt, className }) => <img src={src} alt={alt} className={className} />;

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/admin/users').catch(() => ({ data: [] })),
      API.get('/admin/listings').catch(() => ({ data: mockListings }))
    ])
      .then(([usersRes, listingsRes]) => {
        setUsers(usersRes.data || []);
        // normalize listing amenities to arrays if needed
        const normalized = (listingsRes.data || []).map(l => {
          if (typeof l.amenities === 'string') l.amenities = l.amenities ? l.amenities.split(',').map(s => s.trim()) : [];
          return l;
        });
        setListings(normalized);
      })
      .catch((err) => {
        console.error('Failed to load admin data', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    totalUsers: users.length,
    totalStudents: users.filter(u => u.role && u.role.toLowerCase() === 'student').length,
    totalLandlords: users.filter(u => u.role && u.role.toLowerCase() === 'landlord').length,
    totalListings: listings.length,
    activeListings: listings.filter(l => l.available).length,
    totalInquiries: 342,
    pendingReports: 5,
    platformRevenue: 15420,
    newUsersThisMonth: 89,
    newListingsThisMonth: 12,
  };

  const mockReports = [
    { id: 1, type: 'Listing', title: 'Inappropriate content', reportedBy: 'John Doe', status: 'Pending', date: '2024-10-18', severity: 'High' },
    { id: 2, type: 'User', title: 'Spam messages', reportedBy: 'Jane Smith', status: 'Pending', date: '2024-10-17', severity: 'Medium' },
    { id: 3, type: 'Listing', title: 'Misleading pricing', reportedBy: 'Mike Johnson', status: 'Resolved', date: '2024-10-15', severity: 'Low' },
  ];

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active !== false
    });
  };

  const handleSaveEdit = () => {
    API.put(`/admin/user/${editingUser.id}`, editForm)
      .then(res => {
        setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
        setEditingUser(null);
        setEditForm({ name: '', email: '', role: '', active: true });
      })
      .catch(err => {
        console.error('Failed to save user', err);
        alert('Failed to save user');
      });
  };

  const handleDeleteUser = (user) => setDeleteConfirm(user);
  const confirmDelete = () => {
    API.delete(`/admin/user/${deleteConfirm.id}`)
      .then(() => {
        setUsers(users.filter(u => u.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      })
      .catch(err => {
        console.error('Delete failed', err);
        alert('Delete failed');
      });
  };
  const cancelDelete = () => setDeleteConfirm(null);

  const getUserStatusClass = (status) => status === 'Active' ? 'badge-success' : 'badge-danger';
  const getReportStatusClass = (status) => status === 'Pending' ? 'badge-danger' : 'badge-secondary';
  const getReportSeverityClass = (severity) => {
    if (severity === 'High') return 'badge-danger';
    if (severity === 'Medium') return 'badge-warning';
    return 'badge-secondary';
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
    { id: 'reports', label: 'Reports', badge: stats.pendingReports > 0 ? stats.pendingReports : null },
  ];

  const performanceItems = [
    { icon: <MessageIcon size={20} />, label: 'Total Inquiries', value: stats.totalInquiries, iconColor: 'purple' },
    { icon: <ChartIcon size={20} />, label: 'Conversion Rate', value: '6.8%', iconColor: 'green' },
    { icon: <CheckIcon size={20} />, label: 'Verified Listings', value: Math.round(stats.totalListings * 0.85), iconColor: 'blue' },
    { icon: <UsersIcon size={20} />, label: 'Active Users Today', value: '128', iconColor: 'yellow' },
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
          {user.role === 'Student' ? <GraduationIcon size={14} /> : <BuildingIcon size={14} />} {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      render: (user) => (
        <span className={`badge ${getUserStatusClass(user.active ? 'Active' : 'Suspended')}`}>{user.active ? 'Active' : 'Suspended'}</span>
      )
    },
    {
      header: 'Join Date',
      field: 'joinDate'
    },
    {
      header: 'Actions',
      field: 'actions',
      render: (user) => (
        <div className="user-actions">
          <button className="button button-success button-small" onClick={() => handleEditUser(user)}><span className="icon"><EditIcon size={16} /></span> Edit</button>
          <button className="button button-danger button-small" onClick={() => handleDeleteUser(user)}><span className="icon"><TrashIcon size={16} /></span> Delete</button>
        </div>
      )
    }
  ];

  const approveListing = (id) => {
    API.put(`/admin/listing/${id}/approve`)
      .then(() => {
        setListings(listings.map(l => l.id === id ? { ...l, available: true } : l));
      })
      .catch(err => {
        console.error('Approve failed', err);
      });
  };

  const rejectListing = (id) => {
    API.put(`/admin/listing/${id}/reject`)
      .then(() => {
        setListings(listings.map(l => l.id === id ? { ...l, available: false } : l));
      })
      .catch(err => {
        console.error('Reject failed', err);
      });
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || (user.role || '').toLowerCase().includes(query);
  });

  return (
    <Dashboard
      title="Admin Dashboard"
      subtitle="Manage platform users, listings, and monitor activity"
      tabs={tabs}
      defaultTab="overview"
      renderTabContent={(tab) => {
        if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
        switch (tab) {
          case 'overview':
            return (
              <div className="overview-content">
                <div className="stats-grid">
                  <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon size={24} />} iconColor="blue" description={`+${stats.newUsersThisMonth} this month`} descriptionClass="positive" subtext={<><span>{stats.totalStudents} students</span> • <span>{stats.totalLandlords} landlords</span></>} />
                  <StatCard title="Total Listings" value={stats.totalListings} icon={<HomeIcon size={24} />} iconColor="green" description={`+${stats.newListingsThisMonth} this month`} descriptionClass="positive" subtext={<span>{stats.activeListings} active</span>} />
                  <StatCard title="Pending Reports" value={stats.pendingReports} icon={<WarningIcon size={24} />} iconColor="red" description="Requires attention" descriptionClass="negative" />
                </div>

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
              <>
                <div className="card">
                  <div className="card-header user-management-header">
                    <div>
                      <h3>User Management</h3>
                      <p className="text-muted small-text">{searchQuery.trim() ? `Showing ${filteredUsers.length} of ${users.length} users` : 'View and manage users'}</p>
                    </div>
                    <div className="search-input-wrapper">
                      <span className="icon"><SearchIcon size={18} /></span>
                      <input type="text" placeholder="Search by name, email, role, or status..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input input-with-icon" />
                    </div>
                  </div>
                  <div className="card-content">
                    {filteredUsers.length > 0 ? (
                      <DataTable columns={userColumns} data={filteredUsers} className="users-table" />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        <p>No users found matching "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="button button-secondary" style={{ marginTop: '1rem' }}>Clear Search</button>
                      </div>
                    )}
                  </div>
                </div>

                {editingUser && (
                  <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h3>Edit User</h3>
                        <button className="button button-link" onClick={() => setEditingUser(null)}><CloseIcon size={20} /></button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input" />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="select">
                            <option>Student</option>
                            <option>Landlord</option>
                            <option>Admin</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select value={editForm.active ? 'Active' : 'Suspended'} onChange={(e) => setEditForm({ ...editForm, active: e.target.value === 'Active' })} className="select">
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

                {deleteConfirm && (
                  <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header"><h3>Confirm Delete</h3></div>
                      <div className="modal-body">
                        <p>Are you sure you want to delete user <strong>{deleteConfirm.name}</strong>?</p>
                        <p className="text-muted" style={{ marginTop: '0.5rem' }}>This action cannot be undone.</p>
                      </div>
                      <div className="modal-actions">
                        <button className="button button-secondary" onClick={cancelDelete}>Cancel</button>
                        <button className="button button-danger" onClick={confirmDelete}><span className="icon"><TrashIcon size={16} /></span> Delete User</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
                    {listings.slice(0, 10).map((listing) => (
                      <div key={listing.id} className="admin-listing-item">
                        <div className="admin-listing-image-wrapper">
                          <ImageWithFallback src={listing.image} alt={listing.title} className="admin-listing-image" />
                        </div>
                        <div className="admin-listing-details">
                          <div className="admin-listing-header">
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="admin-listing-location"><span className="icon"><LocationIcon size={16} /></span>{listing.location}</p>
                            </div>
                            <span className={`badge ${listing.available ? 'badge-success' : 'badge-secondary'}`}>{listing.available ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div className="admin-listing-info">
                            <span className="listing-price-admin">₱{listing.price}/mo</span>•
                            <span className="listing-rating-admin"><StarIcon size={14} fill="#FFD700" color="#FFD700" /> {listing.rating}</span>•
                            <span>{listing.reviews} reviews</span>
                          </div>
                          <div className="admin-listing-actions">
                            <button className="button button-secondary button-small"><span className="icon"><EyeIcon size={16} /></span> View</button>
                            <button className="button button-primary button-small" onClick={() => approveListing(listing.id)}><span className="icon"><CheckIcon size={16} /></span> Approve</button>
                            <button className="button button-danger-outline button-small" onClick={() => rejectListing(listing.id)}><span className="icon"><CloseIcon size={16} /></span> Reject</button>
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
                            <span className={`badge ${getReportSeverityClass(report.severity)}`}>{report.severity}</span>
                            <span className={`badge ${getReportStatusClass(report.status)}`}>{report.status}</span>
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
                              <button className="button button-success-outline button-small"><span className="icon"><CheckIcon size={16} /></span> Resolve</button>
                              <button className="button button-secondary button-small"><span className="icon"><CloseIcon size={16} /></span> Dismiss</button>
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
      }}
      className="admin-dashboard-page"
      contentClassName="admin-main-content"
      tabsClassName="admin-tabs-list"
    />
  );
}