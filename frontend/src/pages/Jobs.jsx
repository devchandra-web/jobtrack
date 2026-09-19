import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [status, setStatus] = useState('OPEN');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 9,
        status: status || undefined,
        query: query || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
      };

      const res = await jobService.getJobs(params);
      if (res.success && res.data) {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      }
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, jobType, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setJobType('');
    setStatus('OPEN');
    setSearchParams({});
    setPage(0);
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Explore Open Positions</h2>
        <p className="text-muted">Discover {totalElements} opportunities available right now.</p>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Filters</h5>
              <button className="btn btn-sm text-primary p-0 fw-semibold" onClick={handleResetFilters}>
                Reset
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Keyword</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="Title, skills, company..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Location</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="City, State, or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Job Type</label>
                <select
                  className="form-select form-select-custom"
                  value={jobType}
                  onChange={(e) => {
                    setJobType(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All Job Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Status</label>
                <select
                  className="form-select form-select-custom"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="OPEN">Open Postings Only</option>
                  <option value="CLOSED">Closed Postings</option>
                  <option value="">All Statuses</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100">
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="col-lg-9">
          {loading ? (
            <LoadingSpinner text="Searching positions..." />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon="bi-search"
              title="No matching jobs found"
              message="Try adjusting your keyword search or location filters."
            />
          ) : (
            <>
              <div className="row g-4">
                {jobs.map((job) => (
                  <div key={job.id} className="col-md-6 col-xl-4">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
