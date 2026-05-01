import { toast } from "sonner";

// Show success toast
export const showSuccess = (message: string) => {
  toast.success(message);
};

// Show error toast
export const showError = (message: string) => {
  toast.error(message);
};

// Show info toast
export const showInfo = (message: string) => {
  toast(message);
};
