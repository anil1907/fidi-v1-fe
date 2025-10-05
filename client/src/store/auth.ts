import { create } from "zustand";
import { persist } from "zustand/middleware";

const AUTH_LOGIN_URL: string =
  (import.meta.env.VITE_AUTH_LOGIN_URL as string | undefined) ??
  "/api/v1/users/login";

const AUTH_LOGIN_CULTURE: string =
  (import.meta.env.VITE_AUTH_LOGIN_CULTURE as string | undefined) ?? "tr";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  fullName?: string;
  role?: string;
  title?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;

  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
}

const MOCK_CREDENTIALS = {
  email: "diyetisyen@fidi.com",
  password: "Anil.1907",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

const splitFullName = (fullName?: string, fallback?: string) => {
  const trimmed = (fullName ?? fallback ?? "").trim();
  if (!trimmed) {
    return { firstName: "Kullanici", lastName: "Kullanici" };
  }

  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] || "Kullanici";
  const lastName = parts.slice(1).join(" ") || firstName;

  return { firstName, lastName };
};

const mapUserFromResponse = (apiUser: Record<string, unknown>): User => {
  const fullName = getString(apiUser["fullName"]);
  const username = getString(apiUser["username"]);
  const email = getString(apiUser["email"]);
  const userId = getString(apiUser["userId"]) ?? getString(apiUser["id"]);
  const role = getString(apiUser["role"]);
  const avatar = getString(apiUser["avatar"]);

  const fallbackName = fullName ?? username ?? email ?? "Kullanici";
  const { firstName, lastName } = splitFullName(fullName, fallbackName);

  return {
    id: userId ?? email ?? "user",
    email: email ?? "",
    firstName,
    lastName,
    username,
    fullName: fullName ?? `${firstName} ${lastName}`.trim(),
    role,
    title: role ?? "Diyetisyen",
    avatar,
  };
};

async function resolveErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.clone().json()) as Record<string, unknown>;
    const message = getString(data?.message);
    if (message) {
      return message;
    }

    const error = getString(data?.error);
    if (error) {
      return error;
    }
  } catch (error) {
    // Ignore JSON parse errors and fall back to text body
  }

  try {
    const text = await response.text();
    if (text) {
      return text;
    }
  } catch (error) {
    // Ignore text read errors and fall back to generic message
  }

  return `Login request failed with status ${response.status}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      login: async (credentials) => {
        try {
          const response = await fetch(AUTH_LOGIN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
              culture: AUTH_LOGIN_CULTURE,
            }),
          });

          if (!response.ok) {
            if (response.status === 400 || response.status === 401) {
              set({ isAuthenticated: false, user: null, token: null });
              return false;
            }

            const message = await resolveErrorMessage(response);
            set({ isAuthenticated: false, user: null, token: null });
            throw new Error(message);
          }

          const payload = (await response.json()) as {
            token?: string;
            user?: Record<string, unknown>;
          };

          if (!payload?.token || !payload?.user) {
            set({ isAuthenticated: false, user: null, token: null });
            return false;
          }

          const normalizedUser = mapUserFromResponse(payload.user);

          set({
            isAuthenticated: true,
            user: normalizedUser,
            token: payload.token,
          });

          return true;
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null });
          throw error instanceof Error ? error : new Error("Login request failed");
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },

      register: async (userData) => {
        await sleep(1000);

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: "Diyetisyen",
          username: userData.email,
          fullName: `${userData.firstName} ${userData.lastName}`.trim(),
          role: "Diyetisyen",
        };

        set({
          isAuthenticated: true,
          user: newUser,
          token: null,
        });

        return true;
      },
    }),
    {
      name: "fidi-auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);

export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return { isAuthenticated, user };
};

export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useRegister = () => useAuthStore((state) => state.register);

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const register = useAuthStore((state) => state.register);

  return { login, logout, register };
};

export const getAuthToken = () => useAuthStore.getState().token;

export { MOCK_CREDENTIALS };
