import { useState, useRef, useEffect, useCallback } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = ['Jobs', 'About', 'Contact Us'];
const LOGIN_LETTERS = 'Login'.split('');
const REGISTER_LETTERS = 'Register'.split('');



function Navbar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('recruito_user');
  return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (data) => {
  const { token, ...userInfo } = data;
  localStorage.setItem('recruito_token', token);
  localStorage.setItem('recruito_user', JSON.stringify(userInfo));
  setUser(userInfo);
  setLoginOpen(false);
  setRegisterOpen(false);

  const pendingJobId = localStorage.getItem('recruito_pending_apply_job');
  if (pendingJobId) {
    localStorage.removeItem('recruito_pending_apply_job');
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('recruito:resume-apply', { detail: { jobId: Number(pendingJobId) } }));
    }, 600);
    return;
  }

    navigate(userInfo.role === 'EMPLOYER' ? '/employer/dashboard' : '/');
  };

  const handleLogout = () => {
  localStorage.removeItem('recruito_token');
  localStorage.removeItem('recruito_user');
  setUser(null);
  navigate('/');
  };

  
  const navRef = useRef(null);
  const rafId = useRef(null);
  const loginBtnRef = useRef(null);
  const registerBtnRef = useRef(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOrigin, setLoginOrigin] = useState({ x: 0, y: 0 });
  const [registerOrigin, setRegisterOrigin] = useState({ x: 0, y: 0 });

  const originFromRef = (ref) => {
  const rect = ref.current.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2,
  };
};

const handleLoginClick = (e) => {
  e.preventDefault();
  setLoginOrigin(originFromRef(loginBtnRef));
  setLoginOpen(true);
};

const handleRegisterClick = (e) => {
  e.preventDefault();
  setRegisterOrigin(originFromRef(registerBtnRef));
  setRegisterOpen(true);
};

const switchToRegister = () => {
  setLoginOpen(false);
  setRegisterOrigin(originFromRef(registerBtnRef));
  setRegisterOpen(true);
};

const switchToLogin = () => {
  setRegisterOpen(false);
  setLoginOrigin(originFromRef(loginBtnRef));
  setLoginOpen(true);
};

const handleJobsClick = (e) => {
  e.preventDefault();
  if (user) {
    navigate(user.role === 'EMPLOYER' ? '/employer/jobs' : '/job-seeker/jobs');
    return;
  }
  document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleContactClick = (e) => {
  e.preventDefault();
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

  // Cursor-tracking shine — throttled with requestAnimationFrame to avoid jitter
  const handleMouseMove = useCallback((e) => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const rect = navRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      navRef.current.style.setProperty('--mouse-x', `${x}%`);
      navRef.current.style.setProperty('--mouse-y', `${y}%`);
      rafId.current = null;
    });
  }, []);

  

  // Close search / mobile menu when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  const openLogin = () => {
    setLoginOrigin({ x: 0, y: 0 });
    setLoginOpen(true);
  };
  window.addEventListener('recruito:open-login', openLogin);
  return () => window.removeEventListener('recruito:open-login', openLogin);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') setSearchOpen(false);
  };

  return (
    <>
    <nav className="navbar">
      <div className="navbar-inner" ref={navRef} onMouseMove={handleMouseMove}>
        <div className="shine" aria-hidden="true" />

        <div className="brand">
            <a href="#" className="brand-link">
              <img className="brand-logo" src="/images/recruito-logo.png" alt="" width="762" height="655" />
              <img className="brand-wordmark" src="/images/recruito-wordmark.png" alt="Recruito" width="1115" height="211" />
            </a>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a
              href="#"
              className="bubble-link"
              key={link}
              onClick={
                link === 'Jobs' ? handleJobsClick :
                link === 'Contact Us' ? handleContactClick :
                undefined
              }
            >
              {link}
            </a>
          ))}
        </div>        

        <div className="nav-actions">
          <button
            className={`icon-btn hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="search-cluster">
            <button
              className={`icon-btn ${searchOpen ? 'active' : ''}`}
              onClick={() => setSearchOpen((o) => !o)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className={`search-wrapper ${searchOpen ? 'open' : ''}`}>
              <input
                type="text"
                placeholder="Search jobs..."
                onKeyDown={handleSearchKeyDown}
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
              />
            </div>
          </div>

          

          {user ? (
              <div className="user-chip">
                <span>Hi, {user.fullName.split(' ')[0]}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <a href="#" className="login-link glass-pill" ref={loginBtnRef} onClick={handleLoginClick}>
                  {LOGIN_LETTERS.map((letter, i) => (
                   <span key={i} style={{ '--i': i }} className="letter">{letter}</span>
                  ))}
                </a>

                <a href="#" className="register-btn glass-pill" ref={registerBtnRef} onClick={handleRegisterClick}>
                  {REGISTER_LETTERS.map((letter, i) => (
                    <span key={i} style={{ '--i': i }} className="letter">{letter}</span>
                  ))}
                </a>
              </>
            )}
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            href="#"
            className="mobile-link"
            key={link}
            onClick={(e) => {
              if (link === 'Jobs') handleJobsClick(e);
              if (link === 'Contact Us') handleContactClick(e);
              setMenuOpen(false);
            }}
          >
            {link}
          </a>
        ))}
      </div>     
      </nav>  

    
    <LoginModal
    open={loginOpen}
    onClose={() => setLoginOpen(false)}
    origin={loginOrigin}
    onSwitchToRegister={switchToRegister}
    onAuthSuccess={handleAuthSuccess}
  />

    <RegisterModal
      open={registerOpen}
      onClose={() => setRegisterOpen(false)}
      onAuthSuccess={handleAuthSuccess}
      origin={registerOrigin}
      onSwitchToLogin={switchToLogin}
        />
      </>
  );
  
}

export default Navbar;