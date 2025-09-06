import useToastStore from "../stores/toastStore";

const useToast = () => {
  const {
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  } = useToastStore();

  return {
    toast: addToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAllToasts,
  };
};

export default useToast;
