import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Mobile sidebar state
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  
  // Modal states
  modals: {
    createClient: boolean;
    editClient: boolean;
    createTemplate: boolean;
    editTemplate: boolean;
    createPlan: boolean;
    editPlan: boolean;
    createAppointment: boolean;
    editAppointment: boolean;
    confirmDelete: boolean;
  };
  openModal: (modalName: keyof UIState["modals"]) => void;
  closeModal: (modalName: keyof UIState["modals"]) => void;
  closeAllModals: () => void;
  
  // Filter states
  clientFilter: {
    search: string;
    status: string;
    page: number;
    pageSize: number;
  };
  setClientFilter: (filter: Partial<UIState["clientFilter"]>) => void;
  resetClientFilter: () => void;
  
  // Template builder state
  templateBuilder: {
    isOpen: boolean;
    templateId?: string;
  };
  openTemplateBuilder: (templateId?: string) => void;
  closeTemplateBuilder: () => void;
  
  // Plan preview state
  planPreview: {
    isOpen: boolean;
    planId?: string;
  };
  openPlanPreview: (planId: string) => void;
  closePlanPreview: () => void;
  
  // Calendar view state
  calendarView: "week" | "month";
  setCalendarView: (view: "week" | "month") => void;
  
  // Selected items for bulk actions
  selectedClients: string[];
  setSelectedClients: (clientIds: string[]) => void;
  toggleClientSelection: (clientId: string) => void;
  clearSelectedClients: () => void;
  
  // Notification state
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    timestamp: Date;
    read: boolean;
  }>;
  addNotification: (notification: Omit<UIState["notifications"][0], "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading states
  loading: {
    clients: boolean;
    templates: boolean;
    plans: boolean;
    appointments: boolean;
  };
  setLoading: (key: keyof UIState["loading"], isLoading: boolean) => void;
}

const defaultModalState = {
  createClient: false,
  editClient: false,
  createTemplate: false,
  editTemplate: false,
  createPlan: false,
  editPlan: false,
  createAppointment: false,
  editAppointment: false,
  confirmDelete: false,
};

const defaultClientFilter = {
  search: "",
  status: "all",
  page: 1,
  pageSize: 10,
};

const defaultLoadingState = {
  clients: false,
  templates: false,
  plans: false,
  appointments: false,
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => 
        set({ sidebarCollapsed: collapsed }),
      
      // Mobile sidebar state  
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => 
        set({ mobileSidebarOpen: open }),
      
      // Modal states
      modals: defaultModalState,
      openModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
        })),
      closeModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
        })),
      closeAllModals: () =>
        set({ modals: defaultModalState }),
      
      // Filter states
      clientFilter: defaultClientFilter,
      setClientFilter: (filter) =>
        set((state) => ({
          clientFilter: { ...state.clientFilter, ...filter },
        })),
      resetClientFilter: () =>
        set({ clientFilter: defaultClientFilter }),
      
      // Template builder state
      templateBuilder: {
        isOpen: false,
        templateId: undefined,
      },
      openTemplateBuilder: (templateId) =>
        set({
          templateBuilder: { isOpen: true, templateId },
        }),
      closeTemplateBuilder: () =>
        set({
          templateBuilder: { isOpen: false, templateId: undefined },
        }),
      
      // Plan preview state
      planPreview: {
        isOpen: false,
        planId: undefined,
      },
      openPlanPreview: (planId) =>
        set({
          planPreview: { isOpen: true, planId },
        }),
      closePlanPreview: () =>
        set({
          planPreview: { isOpen: false, planId: undefined },
        }),
      
      // Calendar view state
      calendarView: "week",
      setCalendarView: (view) => set({ calendarView: view }),
      
      // Selected items for bulk actions
      selectedClients: [],
      setSelectedClients: (clientIds) => 
        set({ selectedClients: clientIds }),
      toggleClientSelection: (clientId) =>
        set((state) => {
          const selected = state.selectedClients;
          const isSelected = selected.includes(clientId);
          return {
            selectedClients: isSelected
              ? selected.filter(id => id !== clientId)
              : [...selected, clientId],
          };
        }),
      clearSelectedClients: () => set({ selectedClients: [] }),
      
      // Notification state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // Keep only the latest 50 notifications
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Loading states
      loading: defaultLoadingState,
      setLoading: (key, isLoading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: isLoading },
        })),
    }),
    {
      name: "fidi-ui-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        clientFilter: state.clientFilter,
        calendarView: state.calendarView,
      }),
    }
  )
);

// Selectors for easier access
export const useModalState = () => useUIStore((state) => state.modals);
export const useClientFilter = () => useUIStore((state) => state.clientFilter);
export const useSelectedClients = () => useUIStore((state) => state.selectedClients);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useLoadingState = () => useUIStore((state) => state.loading);
