import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const Profile = () => {
  const { user, updateUser, isRecruiter } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
    }

    if (isRecruiter && user?.id) {
      const fetchRecruiterProfile = async () => {
        try {
          const res = await userService.getRecruiterProfile(user.id);
          if (res.success && res.data) {
            const p = res.data;
            setCompanyName(p.companyName || '');
            setCompanyDescription(p.companyDescription || '');
            setCompanyWebsite(p.companyWebsite || '');
            setLocation(p.location || '');
            setLogoUrl(p.logoUrl || '');
          }
        } catch (err) {
          console.error('Failed to load recruiter profile', err);
        }
      };
      fetchRecruiterProfile();
    }
  }, [user, isRecruiter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      setSaving(true);
      const res = await userService.updateProfile({
        fullName,
        companyName,
        companyDescription,
        companyWebsite,
        location,
        logoUrl,
      });

      if (res.success && res.data) {
        updateUser(res.data);
        setMessage('Profile details updated successfully!');
      }
    } catch (err) {
      console.error('Update profile error', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: '60px', height: '60px' }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-0">{user?.fullName}</h3>
                <span className="badge bg-primary-subtle text-primary border me-2">{user?.role}</span>
                <span className="small text-muted">{user?.email}</span>
              </div>
            </div>

            {message && <div className="alert alert-success rounded-3 mb-4">{message}</div>}
            {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <h5 className="fw-bold text-dark mb-3">Account Details</h5>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-medium text-dark">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control form-control-custom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onInput={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-medium text-dark">Email Address (Read-only)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-custom bg-light"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              {isRecruiter && (
                <>
                  <hr className="my-4" />
                  <h5 className="fw-bold text-dark mb-3">Recruiter & Company Profile</h5>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="companyName" className="form-label fw-medium text-dark">Company Name</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className="form-control form-control-custom"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onInput={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label fw-medium text-dark">Location / Headquarters</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        className="form-control form-control-custom"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onInput={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="companyWebsite" className="form-label fw-medium text-dark">Company Website</label>
                      <input
                        type="url"
                        id="companyWebsite"
                        name="companyWebsite"
                        className="form-control form-control-custom"
                        placeholder="https://example.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        onInput={(e) => setCompanyWebsite(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="logoUrl" className="form-label fw-medium text-dark">Logo Image URL</label>
                      <input
                        type="url"
                        id="logoUrl"
                        name="logoUrl"
                        className="form-control form-control-custom"
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        onInput={(e) => setLogoUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="companyDescription" className="form-label fw-medium text-dark">Company Description</label>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      className="form-control form-control-custom"
                      rows="4"
                      placeholder="Brief overview of your company, mission, and culture..."
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      onInput={(e) => setCompanyDescription(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end border-top pt-4">
                <button type="submit" className="btn btn-primary-custom px-4" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
