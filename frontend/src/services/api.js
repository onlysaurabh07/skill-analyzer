const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token, isFormData } = {}) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  analyze: (formData, token) => request('/analysis/analyze', { method: 'POST', body: formData, token, isFormData: true }),
  getHistory: (token) => request('/analysis/history', { token }),
  getAnalysis: (id, token) => request(`/analysis/${id}`, { token }),
};
