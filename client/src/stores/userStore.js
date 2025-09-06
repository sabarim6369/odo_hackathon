import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: {
        id: null,
        username: "",
        email: "",
        isLoggedIn: false,
      },

      login: (userData) =>
        set({
          user: {
            ...userData,
            isLoggedIn: true,
          },
        }),

      logout: () =>
        set({
          user: {
            id: null,
            username: "",
            email: "",
            isLoggedIn: false,
          },
        }),

      updateProfile: (profileData) =>
        set((state) => ({
          user: {
            ...state.user,
            ...profileData,
          },
        })),

      isAuthenticated: () => get().user.isLoggedIn,
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;
