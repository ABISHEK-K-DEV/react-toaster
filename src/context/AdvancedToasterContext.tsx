import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Toast, 
  ToasterContextValue, 
  ToastPosition, 
  ToastType, 
  ToastConfig,
  ToasterProviderProps,
  ToastTheme,
  ToastQueue
} from '../types';
import { SmartQueue } from '../utils/toastQueue';
import AdvancedToastContainer from '../components/AdvancedToastContainer';

const defaultPosition: ToastPosition = 'top-right';
const defaultDuration = 5000;

const defaultConfig: Required<ToastConfig> = {
  position: defaultPosition,
  duration: defaultDuration,
  priority: 'normal',
  dismissible: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  swipe: { enabled: true, threshold: 100, velocity: 0.3 },
  icon: true,
  sound: false,
  vibrate: false,
  actions: [],
  onClose: () => {},
  onUndo: null,
  onRetry: null,
  className: '',
  style: {},
  groupId: '',
  stackable: false,
};

const defaultQueue: ToastQueue = {
  maxToasts: 5,
  strategy: 'fifo',
  grouping: false,
  maxPerGroup: 3,
};

export const ToasterContext = createContext<ToasterContextValue | undefined>(undefined);

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ 
  children,
  theme = 'auto',
  queue = {},
  defaultConfig: userDefaultConfig = {},
  ...props
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ToastTheme>(theme);
  const queueRef = useRef(new SmartQueue({ ...defaultQueue, ...queue }));
  const mergedDefaultConfig = { ...defaultConfig, ...userDefaultConfig };

  // System theme detection
  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setCurrentTheme(theme);
      try {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } catch (error) {
        // Fallback for older browsers
        return undefined;
      }
    }
  }, [theme]);

  // Focus loss detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      setToasts(current => 
        current.map(toast => {
          if (toast.config.pauseOnFocusLoss) {
            return { ...toast, isPaused: isHidden };
          }
          return toast;
        })
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const createToast = useCallback(
    (content: React.ReactNode, type: ToastType, config?: ToastConfig) => {
      const id = uuidv4();
      const finalConfig = { ...mergedDefaultConfig, ...config };

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

      // Sound and vibration with better error handling
      if (finalConfig.sound && typeof window !== 'undefined' && 'Audio' in window) {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L1vWUeBjuC0fPZfCkFKYfN8tiKOgcZZrns4KdVHQlOouK2tyEeCzyP1++/ZUAFPHfA8Y2BfBwOZX7s7ahOGAg+jdfrwWIiCjnz8yE=');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {
          // Silently fail if audio cannot be played
        }
      }

      if (finalConfig.vibrate && typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch (e) {
          // Silently fail if vibration is not supported
        }
      }

      const updatedToasts = queueRef.current.add(newToast);
      setToasts(updatedToasts);

      return id;
    },
    [mergedDefaultConfig]
  );

  const dismiss = useCallback((id: string) => {
    setToasts(current =>
      current.map(toast =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    setTimeout(() => {
      const updatedToasts = queueRef.current.remove(id);
      setToasts(updatedToasts);
    }, 300);
  }, []);

  const update = useCallback((id: string, content: React.ReactNode, config?: Partial<ToastConfig>) => {
    const updatedToasts = queueRef.current.update(id, {
      content,
      config: { ...mergedDefaultConfig, ...config }
    });
    setToasts(updatedToasts);
  }, [mergedDefaultConfig]);

  const pause = useCallback((id: string) => {
    const updatedToasts = queueRef.current.update(id, { isPaused: true });
    setToasts(updatedToasts);
  }, []);

  const resume = useCallback((id: string) => {
    const updatedToasts = queueRef.current.update(id, { isPaused: false });
    setToasts(updatedToasts);
  }, []);

  const retry = useCallback((id: string) => {
    const toast = toasts.find(t => t.id === id);
    if (toast?.config.onRetry && typeof toast.config.onRetry === 'function') {
      const updatedToasts = queueRef.current.update(id, { 
        retryCount: toast.retryCount + 1,
        isExiting: false,
        remainingTime: toast.config.duration
      });
      setToasts(updatedToasts);
      toast.config.onRetry();
    }
  }, [toasts]);

  const undo = useCallback((id: string) => {
    const toast = toasts.find(t => t.id === id);
    if (toast?.config.onUndo && typeof toast.config.onUndo === 'function') {
      toast.config.onUndo();
      dismiss(id);
    }
  }, [toasts, dismiss]);

  const dismissAll = useCallback(() => {
    setToasts(current =>
      current.map(toast => ({ ...toast, isExiting: true }))
    );

    setTimeout(() => {
      const updatedToasts = queueRef.current.clear();
      setToasts(updatedToasts);
    }, 300);
  }, []);

  const dismissGroup = useCallback((groupId: string) => {
    setToasts(current =>
      current.map(toast =>
        toast.config.groupId === groupId 
          ? { ...toast, isExiting: true } 
          : toast
      )
    );

    setTimeout(() => {
      const updatedToasts = queueRef.current.removeGroup(groupId);
      setToasts(updatedToasts);
    }, 300);
  }, []);

  const setQueue = useCallback((newQueue: Partial<ToastQueue>) => {
    queueRef.current.setConfig(newQueue);
  }, []);

  const value: ToasterContextValue = {
    toasts,
    theme: currentTheme,
    queue: queueRef.current.getAll().length ? defaultQueue : defaultQueue,
    success: useCallback((content, config) => createToast(content, 'success', config), [createToast]),
    error: useCallback((content, config) => createToast(content, 'error', config), [createToast]),
    info: useCallback((content, config) => createToast(content, 'info', config), [createToast]),
    warning: useCallback((content, config) => createToast(content, 'warning', config), [createToast]),
    loading: useCallback((content, config) => createToast(content, 'loading', { duration: Infinity, ...config }), [createToast]),
    custom: useCallback((content, config) => createToast(content, 'custom', config), [createToast]),
    update,
    dismiss,
    dismissAll,
    dismissGroup,
    pause,
    resume,
    retry,
    undo,
    setTheme: setCurrentTheme,
    setQueue,
  };

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <AdvancedToastContainer
        toasts={toasts}
        theme={currentTheme}
        onDismiss={dismiss}
        onPause={pause}
        onResume={resume}
        onUndo={undo}
        onRetry={retry}
        {...props}
      />
    </ToasterContext.Provider>
  );
};
