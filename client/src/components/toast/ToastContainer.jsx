import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute top-4 right-4 w-full max-w-sm sm:max-w-md">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col space-y-3">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  id={toast.id}
                  type={toast.type}
                  title={toast.title}
                  message={toast.message}
                  duration={toast.duration}
                  onRemove={removeToast}
                  autoClose={toast.autoClose}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ToastContainer;
