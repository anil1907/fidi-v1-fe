import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  avatar?: string;
}

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
}

// Mock user for testing - this is what the user requested
const MOCK_USER: User = {
  id: "mock-user-1",
  email: "diyetisyen@fidi.com",
  firstName: "Ahmet",
  lastName: "Yılmaz",
  title: "Diyetisyen",
  avatar: "",
};

const MOCK_CREDENTIALS = {
  email: "diyetisyen@fidi.com",
  password: "123456"
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,

      // Login action with mock authentication
      login: async (credentials) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check mock credentials
        if (
          credentials.email === MOCK_CREDENTIALS.email && 
          credentials.password === MOCK_CREDENTIALS.password
        ) {
          set({
            isAuthenticated: true,
            user: MOCK_USER,
          });
          return true;
        }
        
        return false;
      },

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      // Register action (mock implementation)
      register: async (userData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, always succeed and log in the user
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: "Diyetisyen",
        };
        
        set({
          isAuthenticated: true,
          user: newUser,
        });
        
        return true;
      },
    }),
    {
      name: "fidi-auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Selectors for easier access
export const useAuth = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  user: state.user,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  register: state.register,
}));

// Export mock credentials for user reference
export { MOCK_CREDENTIALS };