import { fetchWithAuth } from "./http";
import { apiRequest } from "./queryClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = {
  // Client endpoints
  getClients: (params?: { search?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());

    const query = searchParams.toString();
    const url = `${API_BASE_URL}/clients${query ? `?${query}` : ""}`;
    return fetchWithAuth(url).then((res) => res.json());
  },

  getClient: (id: string) =>
    fetchWithAuth(`${API_BASE_URL}/clients/${id}`).then((res) => res.json()),

  createClient: (data: any) =>
    apiRequest("POST", `${API_BASE_URL}/clients`, data).then((res) => res.json()),

  updateClient: (id: string, data: any) =>
    apiRequest("PUT", `${API_BASE_URL}/clients/${id}`, data).then((res) => res.json()),

  deleteClient: (id: string) =>
    apiRequest("DELETE", `${API_BASE_URL}/clients/${id}`).then((res) => res.json()),

  // Template endpoints
  getTemplates: () =>
    fetchWithAuth(`${API_BASE_URL}/templates`).then((res) => res.json()),

  getTemplate: (id: string) =>
    fetchWithAuth(`${API_BASE_URL}/templates/${id}`).then((res) => res.json()),

  createTemplate: (data: any) =>
    apiRequest("POST", `${API_BASE_URL}/templates`, data).then((res) => res.json()),

  updateTemplate: (id: string, data: any) =>
    apiRequest("PUT", `${API_BASE_URL}/templates/${id}`, data).then((res) => res.json()),

  deleteTemplate: (id: string) =>
    apiRequest("DELETE", `${API_BASE_URL}/templates/${id}`).then((res) => res.json()),

  // Diet Plan endpoints
  getPlans: (params?: { clientId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set("clientId", params.clientId);

    const query = searchParams.toString();
    const url = `${API_BASE_URL}/plans${query ? `?${query}` : ""}`;
    return fetchWithAuth(url).then((res) => res.json());
  },

  getPlan: (id: string) =>
    fetchWithAuth(`${API_BASE_URL}/plans/${id}`).then((res) => res.json()),

  createPlan: (data: any) =>
    apiRequest("POST", `${API_BASE_URL}/plans`, data).then((res) => res.json()),

  updatePlan: (id: string, data: any) =>
    apiRequest("PUT", `${API_BASE_URL}/plans/${id}`, data).then((res) => res.json()),

  deletePlan: (id: string) =>
    apiRequest("DELETE", `${API_BASE_URL}/plans/${id}`).then((res) => res.json()),

  // Appointment endpoints
  getAppointments: (params?: { clientId?: string; from?: string; to?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set("clientId", params.clientId);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);

    const query = searchParams.toString();
    const url = `${API_BASE_URL}/appointments${query ? `?${query}` : ""}`;
    return fetchWithAuth(url).then((res) => res.json());
  },

  getAppointment: (id: string) =>
    fetchWithAuth(`${API_BASE_URL}/appointments/${id}`).then((res) => res.json()),

  createAppointment: (data: any) =>
    apiRequest("POST", `${API_BASE_URL}/appointments`, data).then((res) => res.json()),

  updateAppointment: (id: string, data: any) =>
    apiRequest("PUT", `${API_BASE_URL}/appointments/${id}`, data).then((res) => res.json()),

  deleteAppointment: (id: string) =>
    apiRequest("DELETE", `${API_BASE_URL}/appointments/${id}`).then((res) => res.json()),
};
