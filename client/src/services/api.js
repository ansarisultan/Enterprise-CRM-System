import axios from 'axios';

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Automatically ensure the API URL ends with /api to prevent 404 routing errors
if (rawApiUrl && !rawApiUrl.endsWith('/api') && !rawApiUrl.endsWith('/api/')) {
  rawApiUrl = rawApiUrl.endsWith('/') ? `${rawApiUrl}api` : `${rawApiUrl}/api`;
}
const API_URL = rawApiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial mock data for offline fallback
const DEFAULT_MOCK_LEADS = [
  {
    _id: 'mock-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@nexustech.com',
    phone: '+1 (555) 019-2834',
    company: 'Nexus Technology',
    status: 'Won',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-2',
    name: 'Michael Chen',
    email: 'mchen@quantumflow.io',
    phone: '+1 (555) 043-9821',
    company: 'Quantum Flow',
    status: 'Qualified',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-3',
    name: 'Emma Rodriguez',
    email: 'emma@apexlabs.dev',
    phone: '+1 (555) 087-1234',
    company: 'Apex Labs',
    status: 'Contacted',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-4',
    name: 'David Kim',
    email: 'd.kim@auroradesign.co',
    phone: '+1 (555) 012-7733',
    company: 'Aurora Design',
    status: 'New',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-5',
    name: 'Olivia Vance',
    email: 'olivia@vancecapital.com',
    phone: '+1 (555) 099-8877',
    company: 'Vance Capital',
    status: 'Lost',
    createdAt: new Date().toISOString()
  }
];

// Helper to interact with LocalStorage
const getLocalLeads = () => {
  const data = localStorage.getItem('leadflow_leads');
  if (!data) {
    localStorage.setItem('leadflow_leads', JSON.stringify(DEFAULT_MOCK_LEADS));
    return DEFAULT_MOCK_LEADS;
  }
  return JSON.parse(data);
};

const saveLocalLeads = (leads) => {
  localStorage.setItem('leadflow_leads', JSON.stringify(leads));
};

let isUsingMockData = false;
let hasDbError = false;

// Safe API wrapper that falls back to LocalStorage if network is down
const handleRequest = async (apiCall, fallbackFn) => {
  try {
    const res = await apiCall();
    isUsingMockData = false;
    hasDbError = false;
    return res;
  } catch (error) {
    // If it's a network error (server offline), fallback
    if (!error.response) {
      console.warn('API Server offline. Falling back to LocalStorage mock database.', error);
      isUsingMockData = true;
      hasDbError = false;
      const data = fallbackFn();
      return { data };
    }
    // If the API responded with an error, set hasDbError to true (unless it is a 400 Bad Request which is usually client validation)
    if (error.response.status !== 400) {
      hasDbError = true;
    }
    throw error;
  }
};

export const getDbStatus = () => ({
  isOffline: isUsingMockData,
  hasError: hasDbError,
  apiUrl: API_URL
});

export const leadAPI = {
  getAll: () => handleRequest(
    () => api.get('/leads'),
    () => getLocalLeads()
  ),
  
  getOne: (id) => handleRequest(
    () => api.get(`/leads/${id}`),
    () => {
      const leads = getLocalLeads();
      return leads.find(l => l._id === id) || null;
    }
  ),
  
  create: (data) => handleRequest(
    () => api.post('/leads', data),
    () => {
      const leads = getLocalLeads();
      const newLead = {
        ...data,
        _id: 'mock-' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      };
      leads.unshift(newLead);
      saveLocalLeads(leads);
      return newLead;
    }
  ),
  
  update: (id, data) => handleRequest(
    () => api.put(`/leads/${id}`, data),
    () => {
      const leads = getLocalLeads();
      const index = leads.findIndex(l => l._id === id);
      if (index !== -1) {
        leads[index] = { ...leads[index], ...data };
        saveLocalLeads(leads);
        return leads[index];
      }
      return null;
    }
  ),
  
  delete: (id) => handleRequest(
    () => api.delete(`/leads/${id}`),
    () => {
      const leads = getLocalLeads();
      const filtered = leads.filter(l => l._id !== id);
      saveLocalLeads(filtered);
      return { message: 'Lead deleted' };
    }
  ),
};

export default api;
