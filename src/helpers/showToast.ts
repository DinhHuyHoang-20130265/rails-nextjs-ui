import { showToast as toast } from "nextjs-toast-notify";

export const showToast = (message: string, type: 'success' | 'error') => {
    toast[type](message, {
        position: 'top-right',
        duration: 5000,
    });
};