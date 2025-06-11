import React from 'react';
import { Toast as ToastType, ToastPosition } from '../types';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  // Group toasts by position
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      const position = toast.config.position || 'top-right';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {
      'top-right': [],
      'top-left': [],
      'top-center': [],
      'bottom-right': [],
      'bottom-left': [],
      'bottom-center': [],
      center: [],
    } as Record<ToastPosition, ToastType[]>
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(
        ([position, positionToasts]) =>
          positionToasts.length > 0 && (
            <div
              key={position}
              className={`toaster-container ${position}`}
            >
              {positionToasts.map((toast: ToastType) => (
                <Toast
                  key={toast.id}
                  toast={toast}
                  onDismiss={onDismiss}
                />
              ))}
            </div>
          )
      )}
    </>
  );
};

export default ToastContainer;
