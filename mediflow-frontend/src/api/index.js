import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally – redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

/* ─── Auth ─── */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
};

/* ─── Medicines ─── */
export const medicineAPI = {
  getAll:      (params) => api.get('/medicines', { params }),
  getById:     (id)     => api.get(`/medicines/${id}`),
  autocomplete:(q, limit=8) => api.get('/medicines/autocomplete', { params: { query: q, limit } }),
  create:      (data)   => api.post('/medicines', data),
  update:      (id, data) => api.put(`/medicines/${id}`, data),
  delete:      (id)     => api.delete(`/medicines/${id}`),
};

/* ─── Categories ─── */
export const categoryAPI = {
  getAll:  ()          => api.get('/categories'),
  create:  (data)      => api.post('/categories', data),
  update:  (id, data)  => api.put(`/categories/${id}`, data),
  delete:  (id)        => api.delete(`/categories/${id}`),
};

/* ─── Inventory ─── */
export const inventoryAPI = {
  getAll:        ()       => api.get('/inventory'),
  getLowStock:   (limit)  => api.get('/inventory/low-stock',     { params: { limit } }),
  getExpiringSoon:(limit) => api.get('/inventory/expiring-soon', { params: { limit } }),
  update:        (data)   => api.post('/inventory', data),
};

/* ─── Cart ─── */
export const cartAPI = {
  getCart:     ()          => api.get('/cart'),
  addItem:     (data)      => api.post('/cart/items', data),
  updateItem:  (id, qty)   => api.put(`/cart/items/${id}?quantity=${qty}`),
  removeItem:  (id)        => api.delete(`/cart/items/${id}`),
  clearCart:   ()          => api.delete('/cart'),
};

/* ─── Orders ─── */
export const orderAPI = {
  getMyOrders: (page=0, size=10) => api.get('/orders', { params: { page, size } }),
  getById:     (id)              => api.get(`/orders/${id}`),
  checkout:    (data)            => api.post('/orders/checkout', data),
  updateStatus:(id, status)      => api.put(`/orders/${id}/status?status=${status}`),
};

/* ─── Prescriptions ─── */
export const prescriptionAPI = {
  upload:  (formData)   => api.post('/prescriptions/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy:   ()           => api.get('/prescriptions'),
  getAll:  (status)     => api.get('/prescriptions/admin/all', { params: status ? { status } : {} }),
  verify:  (id, data)   => api.put(`/prescriptions/admin/${id}/verify`, data),
};

/* ─── Reviews ─── */
export const reviewAPI = {
  getByMedicine: (mid)       => api.get(`/reviews/medicine/${mid}`),
  getMy:         ()          => api.get('/reviews/my'),
  create:        (mid, data) => api.post(`/reviews/medicine/${mid}`, data),
  delete:        (id)        => api.delete(`/reviews/${id}`),
};

/* ─── Delivery ─── */
export const deliveryAPI = {
  getAll:    ()         => api.get('/delivery'),
  getMy:     ()         => api.get('/delivery/my'),
  getById:   (id)       => api.get(`/delivery/${id}`),
  assign:    (data)     => api.post('/delivery/assign', data),
  updateStatus:(id, s)  => api.put(`/delivery/${id}/status?status=${s}`),
};

/* ─── Addresses ─── */
export const addressAPI = {
  getMy:  ()      => api.get('/addresses'),
  add:    (data)  => api.post('/addresses', data),
  delete: (id)    => api.delete(`/addresses/${id}`),
};

/* ─── Admin ─── */
export const adminAPI = {
  getDashboard: ()  => api.get('/admin/dashboard'),
  getCustomers: ()  => api.get('/admin/customers'),
  getAgents:    ()  => api.get('/admin/agents'),
};
