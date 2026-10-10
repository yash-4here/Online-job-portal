import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchMyJobs, deleteJob } from '../api';

function MyJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyJobs(localStorage.getItem('recruito_token')).then(setJobs).finally(() => setLoading(false));
  };
  useEffect(() => {
  let cancelled = false;

  fetchMyJobs(localStorage.getItem('recruito_token'))
    .then((data) => {
      if (!cancelled) setJobs(data);
    })
    .catch((err) => {
      if (!cancelled) console.error('Failed to load jobs:', err);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, []);

  const handleDelete = async (id) => {
    await deleteJob(id, localStorage.getItem('recruito_token'));
    load();
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">Recruito</div>
        <nav className="dash-nav">
          <button className="dash-nav-item" onClick={() => navigate('/employer/dashboard')}>Dashboard</button>
          <button className="dash-nav-item" onClick={() => navigate('/employer/post-job')}>Post a Job</button>
          <button className="dash-nav-item active">My Jobs</button>
        </nav>
      </aside>

      <main className="dash-main">
        <h1 className="dash-heading">My Jobs</h1>
        {location.state?.message && <p className="form-success">{location.state.message}</p>}
        {loading ? <p className="dash-muted">Loading...</p>
          : jobs.length === 0 ? <p className="dash-muted">You haven't posted any jobs yet.</p>
          : (
            <div className="dash-job-list">
              {jobs.map((job) => (
                <div className="dash-job-row" key={job.id}>
                  <div>
                    <p className="dash-job-title">{job.title}</p>
                    <p className="dash-job-meta">{job.companyName} • {job.location} • {job.salary}</p>
                  </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="edit-btn" onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}>Edit</button>
                    <button className="logout-btn" onClick={() => handleDelete(job.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default MyJobs;