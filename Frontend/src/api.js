const API_ROOT = 'http://localhost:8080/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export function loginUser({ email, password }) {
  return fetch(`${API_ROOT}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

export function registerUser({ fullName, email, password, role }) {
  return fetch(`${API_ROOT}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, role }),
  }).then(handleResponse);
}

export function submitApplication(formData, token) {
  return fetch(`${API_ROOT}/applications`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(handleResponse);
}

export function createJob(jobData, token) {
  return fetch(`${API_ROOT}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(jobData),
  }).then(handleResponse);
}

export function fetchJobs() {
  return fetch(`${API_ROOT}/jobs`).then(handleResponse);
}

export function fetchMyJobs(token) {
  return fetch(`${API_ROOT}/employer/jobs`, { headers: { Authorization: `Bearer ${token}` } }).then(handleResponse);
}

export function deleteJob(id, token) {
  return fetch(`${API_ROOT}/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(handleResponse);
}

export function fetchJob(id) {
  return fetch(`${API_ROOT}/jobs/${id}`).then(handleResponse);
}
export function updateJob(id, jobData, token) {
  return fetch(`${API_ROOT}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(jobData),
  }).then(handleResponse);
}