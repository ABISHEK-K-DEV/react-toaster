import React from 'react';
import { Toast as ToastType, ToastPosition, ToastTheme } from '../types';
import AdvancedToast from './AdvancedToast';

interface AdvancedToastContainerProps {
  toasts: ToastType[];
  theme: ToastTheme;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onUndo: (id: string) => void;
  onRetry: (id: string) => void;
  containerClassName?: string;
  newestOnTop?: boolean;
}

const getContainerClasses = (position: ToastPosition): string => {
  const baseClasses = 'fixed z-[9999] flex flex-col gap-3 pointer-events-none p-4 max-w-md';

  switch (position) {
    case 'top-right':
      return `${baseClasses} top-0 right-0 items-end`;
    case 'top-left':
      return `${baseClasses} top-0 left-0 items-start`;
    case 'top-center':
      return `${baseClasses} top-0 left-1/2 transform -translate-x-1/2 items-center`;
    case 'bottom-right':
      return `${baseClasses} bottom-0 right-0 items-end`;
    case 'bottom-left':
      return `${baseClasses} bottom-0 left-0 items-start`;
    case 'bottom-center':
      return `${baseClasses} bottom-0 left-1/2 transform -translate-x-1/2 items-center`;
    case 'center':
      return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center`;
    default:
      return `${baseClasses} top-0 right-0 items-end`;
  }
};

const AdvancedToastContainer: React.FC<AdvancedToastContainerProps> = ({
  toasts,
  theme,
  onDismiss,
  onPause,
  onResume,
  onUndo,
  onRetry,
  containerClassName,
  newestOnTop = true,
}) => {
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
    {} as Record<ToastPosition, ToastType[]>
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(
        ([position, positionToasts]) =>
          positionToasts.length > 0 && (
            <div
              key={position}
              className={`${getContainerClasses(position as ToastPosition)} ${containerClassName || ''}`}
            >
              {(newestOnTop ? [...positionToasts].reverse() : positionToasts).map((toast) => (
                <AdvancedToast
                  key={toast.id}
                  toast={toast}
                  theme={theme}
                  onDismiss={onDismiss}
                  onPause={onPause}
                  onResume={onResume}
                  onUndo={onUndo}
                  onRetry={onRetry}
                />
              ))}
            </div>
          )
      )}
    </>
  );
};

export default AdvancedToastContainer;
