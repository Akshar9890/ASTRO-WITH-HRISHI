import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach admin key on every request if present
api.interceptors.request.use((config) => {
  const key = sessionStorage.getItem('adminKey');
  if (key) config.headers['x-admin-key'] = key;
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      err.message = 'Cannot connect to server. Make sure the backend is running.';
    }
    return Promise.reject(err);
  }
);

export const submitConsultation = (data) => api.post('/consultations', data);
export const getSlots           = ()     => api.get('/consultations/slots');
export const placeOrder         = (data) => api.post('/orders', data);
export const trackOrder         = (id)   => api.get(`/orders/${id}`);
export const trackPageView      = ()     => api.post('/analytics/pageview', {
  page: window.location.pathname,
  referrer: document.referrer,
}).catch(() => {}); // silent — never block the page

// Admin
export const adminStats         = ()           => api.get('/admin/stats');
export const adminConsultations = (params)     => api.get('/admin/consultations', { params });
export const adminOrders        = (params)     => api.get('/admin/orders', { params });
export const updateConsultation = (id, data)   => api.patch(`/admin/consultations/${id}`, data);
export const updateOrder        = (id, data)   => api.patch(`/admin/orders/${id}`, data);

export default api;
