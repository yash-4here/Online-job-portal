import { useState, useRef, useEffect } from 'react';
import { registerUser } from '../api';

function RegisterModal({ open, onClose, origin, onSwitchToLogin, onAuthSuccess }) {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('APPLICANT');
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef(null);

  const handleClose = () => {
  setStep(1);
  setError('');
  setLoading(false);
  onClose();
  };

  useEffect(() => {
    if (!open) return;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) firstInputRef.current?.focus();
  }, [open]);


  const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) handleClose();
};

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim()) {
      setError('Please enter your full name and email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ fullName, email, password, role });
      onAuthSuccess(data);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-overlay ${open ? 'open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!open}
    >
      <div
        className="login-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        style={{
          '--origin-x': `calc(50% + ${origin.x}px)`,
          '--origin-y': `calc(50% + ${origin.y}px)`,
        }}
      >
        <button className="login-close" onClick={handleClose} aria-label="Close register">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="login-scroll">
          <div className="login-card-content">
            <h2 id="register-title" className="login-title">Create Account</h2>

            {error && <p className="form-error">{error}</p>}

            {step === 1 ? (
                <form className="register-step" onSubmit={handleNext}>
                    <div className="login-field">
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                        ref={firstInputRef}
                        type="text"
                        placeholder="Full name"
                        aria-label="Full name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    </div>

                    <div className="login-field">
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 6l-10 7L2 6" />
                        <path d="M2 6h20v12H2z" />
                    </svg>
                    <input
                        type="email"
                        placeholder="Email address"
                        aria-label="Email address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>

                    <button type="submit" className="login-submit">
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                    </button>
                    <div className="login-divider">OR</div>

                    <div className="social-row">
                    <button className="social-btn" aria-label="Continue with Google">
                        <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.1 3 9.2 7.4 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6C29.6 36 26.9 37 24 37c-5.4 0-9.9-3.4-11.3-8.1l-6.6 5.1C9.1 40.6 16 45 24 45z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.5 5.6-6.7 6.9l6.6 5.6C39.1 37.9 43 31.5 43 24c0-1.2-.1-2.4-.4-3.5z"/>
                        </svg>
                    </button>
                    <button className="social-btn" aria-label="Continue with Apple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M16.365 1.43c0 1.14-.475 2.24-1.25 3.06-.85.9-2.24 1.6-3.4 1.5-.14-1.11.47-2.29 1.24-3.06.85-.87 2.29-1.53 3.41-1.5zM20.6 17.06c-.55 1.28-.82 1.85-1.53 2.98-.99 1.58-2.39 3.55-4.12 3.57-1.54.02-1.93-1-4.02-.99-2.08.01-2.5 1-4.04.98-1.73-.02-3.06-1.79-4.05-3.36C.5 16.13-.06 11.4 1.62 8.8c1.19-1.86 3.07-2.96 4.84-2.96 1.8 0 2.93 1 4.42 1 1.44 0 2.32-1 4.42-1 1.58 0 3.25.86 4.44 2.35-3.9 2.14-3.27 7.75.86 8.87z"/>
                        </svg>
                    </button>
                    <button className="social-btn" aria-label="Continue with GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.66.8.55C20.71 21.39 24 17.08 24 12 24 5.73 18.27.5 12 .5z"/>
                        </svg>
                    </button>
                    <button className="social-btn" aria-label="Continue with LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
                        </svg>
                    </button>
                    </div>

                </form>
                ) : (
                <form className="register-step" onSubmit={handleSubmit}>
                    <button type="button" className="back-btn" onClick={handleBack}>
                    ← Back
                    </button>

                    <div className="login-field">
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        aria-label="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                        )}
                    </button>
                    </div>

                    <div className="login-field">
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm password"
                        aria-label="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirm((s) => !s)}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                        {showConfirm ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                        )}
                    </button>
                    </div>

                    <div className="role-toggle" role="radiogroup" aria-label="I am a...">
                    <button
                        type="button"
                        className={`role-option ${role === 'APPLICANT' ? 'active' : ''}`}
                        onClick={() => setRole('APPLICANT')}
                    >
                        Job Seeker
                    </button>
                    <button
                        type="button"
                        className={`role-option ${role === 'EMPLOYER' ? 'active' : ''}`}
                        onClick={() => setRole('EMPLOYER')}
                    >
                        Employer
                    </button>
                    </div>

                    <label className="remember-me" style={{ alignSelf: 'flex-start' }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed((a) => !a)}
                    />
                    <span className="checkbox-box">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                    I agree to the Terms &amp; Privacy Policy
                    </label>

                    <button type="submit" className="login-submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                    {!loading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                        </svg>
                    )}
                    </button>

                </form>
            )}

            <p className="login-footer-text">
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;