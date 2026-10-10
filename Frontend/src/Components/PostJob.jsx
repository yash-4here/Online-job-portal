import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, fetchJob, updateJob } from '../api';

const initial = {
  title: '', companyName: '', location: '', employmentType: 'Full-time',
  department: '', salary: '', description: '', requiredSkills: '',
  education: '', experience: '', industry: '',
};

function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    fetchJob(id)
      .then((job) => setForm({
        title: job.title || '', companyName: job.companyName || '', location: job.location || '',
        employmentType: job.employmentType || 'Full-time', department: job.department || '',
        salary: job.salary || '', description: job.description || '', requiredSkills: job.requiredSkills || '',
        education: job.education || '', experience: job.experience || '', industry: job.industry || '',
      }))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingJob(false));
  }, [id, isEdit]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.companyName.trim() || !form.location.trim()) {
      setError('Title, company, and location are required.');
      return;
    }
        setLoading(true);
    const token = localStorage.getItem('recruito_token');
    try {
      if (isEdit) {
        await updateJob(id, form, token);
        navigate('/employer/jobs', { state: { message: 'Job updated successfully.' } });
      } else {
        await createJob(form, token);
        navigate('/employer/jobs');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">Recruito</div>
        <nav className="dash-nav">
          <button className="dash-nav-item" onClick={() => navigate('/employer/dashboard')}>Dashboard</button>
          <button className="dash-nav-item active">Post a Job</button>
          <button className="dash-nav-item" onClick={() => navigate('/employer/jobs')}>My Jobs</button>
        </nav>
      </aside>

      <main className="dash-main">
        <h1 className="dash-heading">{isEdit ? 'Edit Job' : 'Post a Job'}</h1>
        {loadingJob ? <p className="dash-muted">Loading job...</p> : (
        <form className="post-job-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <div className="apply-row">
            <input placeholder="Job Title" value={form.title} onChange={update('title')} />
            <input placeholder="Company Name" value={form.companyName} onChange={update('companyName')} />
          </div>
          <div className="apply-row">
            <input placeholder="Location" value={form.location} onChange={update('location')} />
            <select value={form.employmentType} onChange={update('employmentType')}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option>
            </select>
          </div>
          <div className="apply-row">
            <input placeholder="Department" value={form.department} onChange={update('department')} />
            <input placeholder="Industry" value={form.industry} onChange={update('industry')} />
          </div>
          <input placeholder="Salary (e.g. ₹12–18 LPA)" value={form.salary} onChange={update('salary')} />
          <input placeholder="Required Skills (comma separated)" value={form.requiredSkills} onChange={update('requiredSkills')} />
          <div className="apply-row">
            <input placeholder="Educational Qualifications" value={form.education} onChange={update('education')} />
            <input placeholder="Experience (e.g. 2-4 years)" value={form.experience} onChange={update('experience')} />
          </div>
          <textarea placeholder="Job Description" rows={4} value={form.description} onChange={update('description')} />
                    <button type="submit" className="login-submit" disabled={loading}>
            {isEdit ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Posting...' : 'Post Job')}
          </button>
        </form>
        )}
      </main>
    </div>
  );
}

export default PostJob;