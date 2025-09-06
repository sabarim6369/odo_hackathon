import { create } from "zustand";

const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      autoClose: true,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  // Convenience methods for different toast types
  success: (title, message, options = {}) => {
    return get().addToast({
      type: "success",
      title,
      message,
      ...options,
    });
  },

  error: (title, message, options = {}) => {
    return get().addToast({
      type: "error",
      title,
      message,
      duration: 7000, // Error messages stay longer
      ...options,
    });
  },

  warning: (title, message, options = {}) => {
    return get().addToast({
      type: "warning",
      title,
      message,
      ...options,
    });
  },

  info: (title, message, options = {}) => {
    return get().addToast({
      type: "info",
      title,
      message,
      ...options,
    });
  },
}));

export default useToastStore;
