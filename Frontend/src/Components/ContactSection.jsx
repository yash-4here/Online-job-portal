function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-card">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">Need help with Recruito?</p>
        <p className="contact-text">
          Whether you're a job seeker facing an issue while applying for a job,
          or an employer facing an issue while posting or managing jobs, we're here to help.
        </p>
        <p className="contact-label">For help and support, contact us at:</p>
        <a href="mailto:support.recruito@gmail.com" className="contact-email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" opacity="0" />
            <path d="M22 6l-10 7L2 6" />
            <path d="M2 6h20v12H2z" />
          </svg>
          support.recruito@gmail.com
        </a>
      </div>
    </section>
  );
}

export default ContactSection;