import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-5 mt-auto border-top border-slate-800" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-briefcase-fill text-primary"></i> JobTrack
            </h5>
            <p className="small mb-3">
              JobTrack is an end-to-end recruitment management and job application portal empowering candidates to land their dream roles and recruiters to hire top talent efficiently.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-slate-400 text-decoration-none"><i className="bi bi-linkedin fs-5"></i></a>
              <a href="#" className="text-slate-400 text-decoration-none"><i className="bi bi-github fs-5"></i></a>
              <a href="#" className="text-slate-400 text-decoration-none"><i className="bi bi-twitter-x fs-5"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-slate-400 hover:text-white">Home</Link></li>
              <li className="mb-2"><Link to="/jobs" className="text-decoration-none text-slate-400">Browse Jobs</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-slate-400">Candidate Sign In</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-slate-400">Recruiter Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Job Categories</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/jobs?jobType=FULL_TIME" className="text-decoration-none text-slate-400">Full Time Engineering</Link></li>
              <li className="mb-2"><Link to="/jobs?jobType=REMOTE" className="text-decoration-none text-slate-400">Remote Software Jobs</Link></li>
              <li className="mb-2"><Link to="/jobs?jobType=CONTRACT" className="text-decoration-none text-slate-400">Contract Developer Roles</Link></li>
              <li className="mb-2"><Link to="/jobs?jobType=PART_TIME" className="text-decoration-none text-slate-400">Part Time Positions</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Contact & Support</h6>
            <p className="small mb-2"><i className="bi bi-envelope me-2 text-primary"></i> support@jobtrack.com</p>
            <p className="small mb-2"><i className="bi bi-geo-alt me-2 text-primary"></i> San Francisco & Bangalore</p>
            <p className="small"><i className="bi bi-shield-check me-2 text-success"></i> Secure 256-bit JWT Auth</p>
          </div>
        </div>

        <hr className="my-4 border-slate-800" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small">
          <p className="mb-0">&copy; {new Date().getFullYear()} JobTrack. Built for Java Full Stack Portfolio.</p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <a href="#" className="text-decoration-none text-slate-400">Privacy Policy</a>
            <a href="#" className="text-decoration-none text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
