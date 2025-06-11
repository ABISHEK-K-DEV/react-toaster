import React from 'react';
import { Toast, ToastTheme, ToastPosition } from '../types';
import { getEffectiveTheme } from '../utils/themeUtils';
import AdvancedToast from './AdvancedToast';

interface AdvancedToastContainerProps {
  toasts: Toast[];
  theme: ToastTheme;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onUndo: (id: string) => void;
  onRetry: (id: string) => void;
  containerClassName?: string;
  newestOnTop?: boolean;
}

const getPositionClasses = (position: ToastPosition): string => {
  switch (position) {
    case 'top-right':
      return 'fixed top-4 right-4 z-50';
    case 'top-left':
      return 'fixed top-4 left-4 z-50';
    case 'top-center':
      return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
    case 'bottom-right':
      return 'fixed bottom-4 right-4 z-50';
    case 'bottom-left':
      return 'fixed bottom-4 left-4 z-50';
    case 'bottom-center':
      return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50';
    case 'center':
      return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
    default:
      return 'fixed top-4 right-4 z-50';
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
  containerClassName = '',
  newestOnTop = true,
}) => {
  const effectiveTheme = getEffectiveTheme(theme);

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.config.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`${getPositionClasses(position as ToastPosition)} flex flex-col gap-2 pointer-events-none ${containerClassName}`}
          style={{
            maxWidth: '420px',
            width: '100%',
          }}
        >
          {(newestOnTop ? [...positionToasts].reverse() : positionToasts).map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <AdvancedToast
                toast={toast}
                theme={theme}
                onDismiss={onDismiss}
                onPause={onPause}
                onResume={onResume}
                onUndo={onUndo}
                onRetry={onRetry}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default AdvancedToastContainer;
