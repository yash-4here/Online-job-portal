import { useState, useEffect } from 'react';
import { submitApplication } from '../api';

function ApplicationModal({ job, open, onClose }) {
  const storedUser = JSON.parse(localStorage.getItem('recruito_user') || 'null');

  const [fullName, setFullName] = useState(storedUser?.fullName || '');
  const [email, setEmail] = useState(storedUser?.email || '');
  const [phone, setPhone] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [skills, setSkills] = useState('');
  const [certificateFiles, setCertificateFiles] = useState([]);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resume, setResume] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
  setError('');
  setLoading(false);
  setSuccess(false);
  setResume(null);
  onClose();
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);


  if (!open || !job) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !resume) {
      setError('Please fill in name, email, phone, and attach your resume.');
      return;
    }

    const token = localStorage.getItem('recruito_token');
    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('jobTitle', job.role);
    formData.append('company', job.company);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('qualifications', qualifications);
    formData.append('skills', skills);
    certificateFiles.forEach((file) => formData.append('certificates', file));
    formData.append('linkedinUrl', linkedinUrl);
    formData.append('githubUrl', githubUrl);
    formData.append('portfolioUrl', portfolioUrl);
    formData.append('resume', resume);

    setLoading(true);
    try {
      await submitApplication(formData, token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-overlay open" onClick={handleOverlayClick}>
      <div className="apply-card" role="dialog" aria-modal="true">
        <button className="login-close" onClick={handleClose} aria-label="Close application">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div className="apply-success">
            <h2 className="login-title">Application Sent</h2>
            <p className="login-subtitle">
              Your application for {job.role} at {job.company} has been submitted.
            </p>
            <button className="login-submit" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="login-title">Apply to {job.company}</h2>
            <p className="login-subtitle">{job.role} · {job.location}</p>

            <form className="apply-form" onSubmit={handleSubmit}>
              {error && <p className="form-error">{error}</p>}

              <div className="apply-row">
                <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <input type="tel" placeholder="Contact number" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <textarea placeholder="Qualifications (degree, university, year...)" value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows={2} />

              <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />

              <label className="apply-file-label">
                Certificates (PDF/JPG/PNG, optional)
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => setCertificateFiles(Array.from(e.target.files))} />
              </label>

              <div className="apply-row">
                <input type="url" placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                <input type="url" placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
              <input type="url" placeholder="Portfolio URL (optional)" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />

              <label className="apply-file-label">
                Resume (PDF/DOC)
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
              </label>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplicationModal;