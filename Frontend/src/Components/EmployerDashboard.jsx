import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyJobs } from '../api';

function EmployerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('recruito_user') || 'null');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs(localStorage.getItem('recruito_token'))
      .then(setJobs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('recruito_token');
    localStorage.removeItem('recruito_user');
    navigate('/');
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">Recruito</div>
        <nav className="dash-nav">
          <button className="dash-nav-item active">Dashboard</button>
          <button className="dash-nav-item" onClick={() => navigate('/employer/post-job')}>Post a Job</button>
          <button className="dash-nav-item" onClick={() => navigate('/employer/jobs')}>My Jobs</button>
          <button className="dash-nav-item" disabled>Applicants</button>
          <button className="dash-nav-item" disabled>Company Profile</button>
          <button className="dash-nav-item" disabled>Settings</button>
          <button className="dash-nav-item logout" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="dash-main">
        <h1 className="dash-heading">Good day, {user?.fullName?.split(' ')[0]}</h1>

        <div className="dash-stats">
          <div className="dash-stat-card">
            <span className="dash-stat-value">{jobs.length}</span>
            <span className="dash-stat-label">Jobs Posted</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-value">{jobs.filter((j) => j.status === 'ACTIVE').length}</span>
            <span className="dash-stat-label">Active Jobs</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-value">—</span>
            <span className="dash-stat-label">Total Applications</span>
          </div>
        </div>

        <h2 className="dash-subheading">Recent Jobs</h2>
        {loading ? <p className="dash-muted">Loading...</p>
          : jobs.length === 0 ? <p className="dash-muted">No jobs posted yet.</p>
          : (
            <div className="dash-job-list">
              {jobs.slice(0, 5).map((job) => (
                <div className="dash-job-row" key={job.id}>
                  <div>
                    <p className="dash-job-title">{job.title}</p>
                    <p className="dash-job-meta">{job.employmentType} • {job.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default EmployerDashboard;