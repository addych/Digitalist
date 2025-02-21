import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light"
};

export const toastSuccess = (message) => {
  toast.success(message, toastConfig);
};

export const toastError = (message) => {
  toast.error(message, toastConfig);
};