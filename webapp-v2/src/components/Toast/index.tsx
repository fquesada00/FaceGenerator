import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CustomToastContainer: React.FC = () => (
  <ToastContainer
    position='bottom-right'
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme='colored'
    style={{ fontSize: '1rem' }}
  />
);

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastInfo = (message: string) => {
  toast.info(message);
};

export const toastWarning = (message: string) => {
  toast.warning(message);
};
