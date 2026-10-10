function Hero() {
  return (
    <section className="hero">
     <div className="hero-layout">
       <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Opportunities for a Better Tomorrow
          </div>

          <h1 className="hero-heading">
            Find Your Next<br />
            <span className="heading-accent">Opportunity</span>
          </h1>

          <p className="hero-subtext">
            Discover jobs that match your skills, experience, and career goals.
            From top companies to exciting startups — it all starts here.
          </p>

          <form className="hero-search" id="searchForm">
            <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search for jobs, companies, or skills..."
              name="search"
              id="searchInput"
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>

          <div className="hero-chips">
            <button type="button" className="hero-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Full-time
            </button>
            <button type="button" className="hero-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Remote
            </button>
            <button type="button" className="hero-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 4 2 10l10 6 10-6z" />
                <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Internship
            </button>
            <button type="button" className="hero-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
              Part-time
            </button>
          </div>

                    <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <span className="stat-divider" />
            <div className="stat">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Companies</span>
            </div>
            <span className="stat-divider" />
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Job Seekers</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;