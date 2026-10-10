const GRADIENTS = [
  'linear-gradient(135deg, #a855f7, #6366f1)',
  'linear-gradient(135deg, #22c55e, #16a34a)',
  'linear-gradient(135deg, #ef4444, #b91c1c)',
  'linear-gradient(135deg, #f43f5e, #e11d48)',
  'linear-gradient(135deg, #00a4ef, #7fba00)',
  'linear-gradient(135deg, #ff9900, #cc7a00)',
  'linear-gradient(135deg, #0866ff, #0047b3)',
  'linear-gradient(135deg, #64748b, #334155)',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Backend Job -> shape the (visually unchanged) JobCard expects.
// `role` and `company` are kept so ApplicationModal keeps working untouched.
export function normalizeJob(job) {
  const company = (job.companyName || 'Company').trim();
  return {
    id: job.id,
    company,
    logoUrl: job.companyLogo || null,
    logoLetter: company.charAt(0).toUpperCase() || '?',
    logoColor: GRADIENTS[hash(company) % GRADIENTS.length],
    verified: false, // no verification field in the backend — never fake it
    location: job.location || 'Not specified',
    role: job.title,
    category: job.department || job.industry || 'General',
    type: job.employmentType || 'Full-time',
    salary: job.salary || 'Salary not disclosed',
    skills: (job.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    extraSkills: 0,
    education: job.education || 'Not specified',
    experience: job.experience || 'Not specified',
    industry: job.industry || 'Not specified',
  };
}