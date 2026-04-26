import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((r) => r.data),
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post("/auth/register", data).then((r) => r.data),
  registerAdmin: (data: { fullName: string; email: string; password: string; adminSecret: string }) =>
    api.post("/auth/register-admin", data).then((r) => r.data),
};

export const adminApi = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
  getEvents: () => api.get("/events").then((r) => r.data),
  getEvent: (id: string) => api.get(`/events/${id}`).then((r) => r.data),
  createEvent: (data: any) => api.post("/admin/events", data).then((r) => r.data),
  updateEvent: (id: string, data: any) => api.put(`/admin/events/${id}`, data).then((r) => r.data),
  deleteEvent: (id: string) => api.delete(`/admin/events/${id}`).then((r) => r.data),
  getUsers: () => api.get("/admin/users").then((r) => r.data),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  getRecentTickets: () => api.get("/tickets/recent").then((r) => r.data),
};
