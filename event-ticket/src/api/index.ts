import { api } from "./client";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  time?: string;
  location: string;
  capacity: number;
  registered?: number;
  spotsLeft?: number;
}

export interface Ticket {
  ticketCode: string;
  status: "valid" | "cancelled";
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  event: EventItem;
}

// Auth
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
};

// Events
export const eventsApi = {
  list: () => api.get<EventItem[]>("/events").then((r) => r.data),
  get: (id: string) => api.get<EventItem>(`/events/${id}`).then((r) => r.data),
  register: (id: string) => api.post<Ticket>(`/events/${id}/register`, {}).then((r) => r.data),
};

// Tickets
export const ticketsApi = {
  mine: () => api.get<Ticket[]>("/tickets/my").then((r) => r.data),
  get: (code: string) => api.get<Ticket>(`/tickets/${code}`).then((r) => r.data),
  unregister: (ticketCode: string) => api.delete(`/tickets/${ticketCode}`).then((r) => r.data),
};
