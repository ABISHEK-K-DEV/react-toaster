import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ToasterContextValue, ToastPosition, ToastType, ToasterOptions, ToastConfig } from '../types';
import ToastContainer from '../components/ToastContainer';

const defaultPosition: ToastPosition = 'top-right';
const defaultDuration = 5000; // 5 seconds

export const ToasterContext = createContext<ToasterContextValue | undefined>(undefined);

export const ToasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const createToast = useCallback(
    (content: React.ReactNode, type: ToastType, options?: ToasterOptions) => {
      const id = uuidv4();
      
      // Create a proper ToastConfig from ToasterOptions
      const finalConfig: Required<ToastConfig> = {
        position: options?.position || 'top-right',
        duration: options?.duration || 5000,
        priority: 'normal',
        dismissible: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        swipe: { enabled: true, threshold: 100, velocity: 0.3 },
        icon: true,
        sound: false,
        vibrate: false,
        actions: [],
        onClose: options?.onClose || (() => {}),
        onUndo: null,
        onRetry: null,
        className: options?.className || '',
        style: options?.style || {},
        groupId: '',
        stackable: false,
      };

      const newToast: Toast = {
        id,
        content,
        type,
        config: finalConfig,
        timestamp: Date.now(),
        isExiting: false,
        isPaused: false,
        remainingTime: finalConfig.duration,
        swipeProgress: 0,
        retryCount: 0,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (finalConfig.duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
          finalConfig.onClose && finalConfig.onClose();
        }, finalConfig.duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 300); // Match animation duration
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) => ({ ...toast, isExiting: true }))
    );

    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  const value: ToasterContextValue = {
    toasts,
    theme: 'light', // Add default theme
    queue: { maxToasts: 5, strategy: 'fifo', grouping: false, maxPerGroup: 3 }, // Add default queue
    success: useCallback((content, config) => createToast(content, 'success', config), [createToast]),
    error: useCallback((content, config) => createToast(content, 'error', config), [createToast]),
    info: useCallback((content, config) => createToast(content, 'info', config), [createToast]),
    warning: useCallback((content, config) => createToast(content, 'warning', config), [createToast]),
    loading: useCallback((content, config) => createToast(content, 'loading', { duration: Infinity, ...config }), [createToast]),
    custom: useCallback((content, config) => createToast(content, 'custom', config), [createToast]),
    update: () => {}, // Add stub implementation
    dismiss,
    dismissAll: () => {}, // Add stub implementation
    dismissGroup: () => {}, // Add stub implementation
    pause: () => {}, // Add stub implementation
    resume: () => {}, // Add stub implementation
    retry: () => {}, // Add stub implementation
    undo: () => {}, // Add stub implementation
    setTheme: () => {}, // Add stub implementation
    setQueue: () => {}, // Add stub implementation
  };

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToasterContext.Provider>
  );
};
