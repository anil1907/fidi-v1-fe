import { apiRequest } from "./queryClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = {
  // Client endpoints
  getClients: (params?: { search?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());
    
    return fetch(`${API_BASE_URL}/clients?${searchParams.toString()}`).then(res => res.json());
  },
  
  getClient: (id: string) => 
    fetch(`${API_BASE_URL}/clients/${id}`).then(res => res.json()),
  
  createClient: (data: any) => 
    apiRequest("POST", `${API_BASE_URL}/clients`, data).then(res => res.json()),
  
  updateClient: (id: string, data: any) => 
    apiRequest("PUT", `${API_BASE_URL}/clients/${id}`, data).then(res => res.json()),
  
  deleteClient: (id: string) => 
    apiRequest("DELETE", `${API_BASE_URL}/clients/${id}`).then(res => res.json()),

  // Template endpoints
  getTemplates: () => 
    fetch(`${API_BASE_URL}/templates`).then(res => res.json()),
  
  getTemplate: (id: string) => 
    fetch(`${API_BASE_URL}/templates/${id}`).then(res => res.json()),
  
  createTemplate: (data: any) => 
    apiRequest("POST", `${API_BASE_URL}/templates`, data).then(res => res.json()),
  
  updateTemplate: (id: string, data: any) => 
    apiRequest("PUT", `${API_BASE_URL}/templates/${id}`, data).then(res => res.json()),
  
  deleteTemplate: (id: string) => 
    apiRequest("DELETE", `${API_BASE_URL}/templates/${id}`).then(res => res.json()),

  // Diet Plan endpoints
  getPlans: (params?: { clientId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set("clientId", params.clientId);
    
    return fetch(`${API_BASE_URL}/plans?${searchParams.toString()}`).then(res => res.json());
  },
  
  getPlan: (id: string) => 
    fetch(`${API_BASE_URL}/plans/${id}`).then(res => res.json()),
  
  createPlan: (data: any) => 
    apiRequest("POST", `${API_BASE_URL}/plans`, data).then(res => res.json()),
  
  updatePlan: (id: string, data: any) => 
    apiRequest("PUT", `${API_BASE_URL}/plans/${id}`, data).then(res => res.json()),
  
  deletePlan: (id: string) => 
    apiRequest("DELETE", `${API_BASE_URL}/plans/${id}`).then(res => res.json()),

  // Appointment endpoints
  getAppointments: (params?: { clientId?: string; from?: string; to?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.clientId) searchParams.set("clientId", params.clientId);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);
    
    return fetch(`${API_BASE_URL}/appointments?${searchParams.toString()}`).then(res => res.json());
  },
  
  getAppointment: (id: string) => 
    fetch(`${API_BASE_URL}/appointments/${id}`).then(res => res.json()),
  
  createAppointment: (data: any) => 
    apiRequest("POST", `${API_BASE_URL}/appointments`, data).then(res => res.json()),
  
  updateAppointment: (id: string, data: any) => 
    apiRequest("PUT", `${API_BASE_URL}/appointments/${id}`, data).then(res => res.json()),
  
  deleteAppointment: (id: string) => 
    apiRequest("DELETE", `${API_BASE_URL}/appointments/${id}`).then(res => res.json()),
};
