import { useState } from 'react';

const MINI_SKILLS_PREVIEW = 2;

function JobCard({ job, cardRef, expanded, dimmed, transitioning, onApply }) {
  const [bookmarked, setBookmarked] = useState(false);
  const visibleSkills = expanded ? job.skills : job.skills.slice(0, MINI_SKILLS_PREVIEW);
  const hiddenCount = expanded
    ? job.extraSkills
    : Math.max(0, job.skills.length - MINI_SKILLS_PREVIEW) + job.extraSkills;

  return (
    <div
      ref={cardRef}
      className={`job-card ${expanded ? 'expanded' : 'mini'} ${dimmed ? 'dimmed' : ''} ${transitioning ? 'state-change' : ''}`}
      data-expanded={expanded ? 'true' : 'false'}
    >
      <div className="job-card-glow" aria-hidden="true" />

      <div className="job-card-top">
        <div className="job-logo" style={job.logoUrl ? undefined : { background: job.logoColor }}>
          {job.logoUrl ? <img src={job.logoUrl} alt="" /> : <span>{job.logoLetter}</span>}
        </div>

        <div className="job-company-block">
          <div className="job-company-name">
            {job.company}
            {job.verified && (
              <svg className="verified-badge" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 2.2 3.2-.6.9 3.1 3 1.3-1 3.1 1.9 2.6-1.9 2.6 1 3.1-3 1.3-.9 3.1-3.2-.6L12 22l-2.4-2.2-3.2.6-.9-3.1-3-1.3 1-3.1L1.6 12l1.9-2.6-1-3.1 3-1.3.9-3.1 3.2.6L12 2z" opacity="0.15"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="job-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location}
          </div>
        </div>

        <button
          type="button"
          className={`bookmark-btn ${bookmarked ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setBookmarked((b) => !b); }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Save job'}
          aria-pressed={bookmarked}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <h3 className="job-role">{job.role}</h3>
      <p className="job-meta">{job.category} <span className="meta-dot">•</span> {job.type}</p>

      <div className="job-salary-row">
        <div className="job-salary-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <circle cx="12" cy="14" r="2" />
          </svg>
        </div>
        <span className="job-salary">{job.salary}</span>
      </div>

      <div className="job-divider" />

      <p className="job-section-label">Required Skills</p>
      <div className="job-skills">
        {visibleSkills.map((skill) => (
          <span className="skill-pill" key={skill}>{skill}</span>
        ))}
        {hiddenCount > 0 && <span className="skill-pill skill-more">+{hiddenCount}</span>}
      </div>

      {expanded && (
        <>
          <div className="job-education-row">
            <div className="job-education-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 4 2 10l10 6 10-6z" />
                <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
              </svg>
            </div>
            <div>
              <p className="job-section-label">Educational Qualifications</p>
              <p className="job-education-text">{job.education}</p>
            </div>
          </div>

          <div className="job-bottom-row">
            <div className="job-bottom-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div>
                <p className="stat-value">{job.experience}</p>
                <p className="stat-key">Experience</p>
              </div>
            </div>

            <div className="job-bottom-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <div>
                <p className="stat-value">{job.industry}</p>
                <p className="stat-key">Industry</p>
              </div>
            </div>

            <button type="button" className="apply-btn" onClick={(e) => { e.stopPropagation(); onApply(job); }}>
              Apply
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default JobCard;