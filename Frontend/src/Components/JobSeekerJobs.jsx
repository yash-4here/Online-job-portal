import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../api';

function JobSeekerJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs().then(setJobs).finally(() => setLoading(false)); }, []);

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
          <button className="dash-nav-item active">Jobs</button>
          <button className="dash-nav-item logout" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="dash-main">
        <h1 className="dash-heading">Available Jobs</h1>
        {loading ? <p className="dash-muted">Loading...</p>
          : jobs.length === 0 ? <p className="dash-muted">No jobs posted yet. Check back soon.</p>
          : (
            <div className="seeker-job-grid">
              {jobs.map((job) => (
                <div className="seeker-job-card" key={job.id}>
                  <p className="job-company-name">{job.companyName}</p>
                  <h3 className="job-role">{job.title}</h3>
                  <p className="job-meta">{job.employmentType} <span className="meta-dot">•</span> {job.location}</p>
                  {job.salary && <p className="job-salary">{job.salary}</p>}
                  {job.requiredSkills && (
                    <div className="job-skills">
                      {job.requiredSkills.split(',').map((s) => <span className="skill-pill" key={s}>{s.trim()}</span>)}
                    </div>
                  )}
                  {job.education && <p className="dash-muted">{job.education}</p>}
                  <button className="apply-btn" type="button">Apply</button>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default JobSeekerJobs;