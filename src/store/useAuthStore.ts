import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  isInitialized: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      checkAuthStatus: async () => {
        set({ isLoading: true });

        try {
          const res = await axios.get("http://localhost:5000/auth/status", {
            withCredentials: true,
          });

          const data = res.data;

          if (data.isAuthenticated) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              isInitialized: true,
            });
            toast.success("Authenticated successfully");
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              isInitialized: true,
            });
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          toast.error("Authentication check failed");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Something went wrong",
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
