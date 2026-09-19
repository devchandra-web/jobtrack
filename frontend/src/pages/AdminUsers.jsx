import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Status toggle modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        query: searchQuery || undefined,
      };
      const res = await userService.getAdminUsers(params);
      if (res.success && res.data) {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching admin users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;
    const targetStatus = selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      setUpdating(true);
      await userService.updateUserStatus(selectedUser.id, targetStatus);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Error updating user status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">
          <i className="bi bi-people-fill text-primary me-2"></i> System User Management
        </h2>
        <p className="text-muted">View, search, and manage registered candidates, recruiters, and admins.</p>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-dark">Search User</label>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Name or email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-dark">Filter by Role</label>
              <select
                className="form-select form-select-custom"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">All Roles</option>
                <option value="CANDIDATE">CANDIDATE</option>
                <option value="RECRUITER">RECRUITER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-dark">Status</label>
              <select
                className="form-select form-select-custom"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary-custom w-100">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        {loading ? (
          <LoadingSpinner text="Fetching system users..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon="bi-people text-muted"
            title="No Users Found"
            message="No user accounts match your search query."
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Full Name & Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered Date</th>
                    <th className="text-end">Account Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td><span className="small text-muted font-monospace">#{u.id}</span></td>
                      <td>
                        <div className="fw-bold text-dark">{u.fullName}</div>
                        <div className="small text-muted">{u.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-warning text-dark' : u.role === 'RECRUITER' ? 'bg-success text-white' : 'bg-primary text-white'} px-2.5 py-1 rounded-pill`}>
                          {u.role}
                        </span>
                      </td>
                      <td><StatusBadge type="userStatus" value={u.status} /></td>
                      <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        {u.role === 'ADMIN' ? (
                          <span className="badge bg-light text-muted border">System Admin</span>
                        ) : (
                          <button
                            className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => setSelectedUser(u)}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>

      {selectedUser && (
        <ConfirmModal
          show={!!selectedUser}
          title={selectedUser.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
          message={`Are you sure you want to ${selectedUser.status === 'ACTIVE' ? 'deactivate' : 'activate'} the user account for "${selectedUser.fullName}" (${selectedUser.email})?`}
          confirmText={updating ? 'Updating...' : selectedUser.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
          confirmVariant={selectedUser.status === 'ACTIVE' ? 'danger' : 'success'}
          onConfirm={handleToggleUserStatus}
          onCancel={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
