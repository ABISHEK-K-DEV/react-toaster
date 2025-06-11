import { ReactNode, CSSProperties } from 'react';

export type ToastPosition = 
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'center';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'custom';

export type ToastTheme = 'light' | 'dark' | 'auto';

export type ToastPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ToastAction {
  label: string;
  onClick: (id: string) => void;
  style?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export interface SwipeConfig {
  enabled: boolean;
  threshold: number;
  velocity: number;
}

export interface ToastConfig {
  position?: ToastPosition;
  duration?: number;
  priority?: ToastPriority;
  dismissible?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocusLoss?: boolean;
  swipe?: SwipeConfig;
  icon?: ReactNode | boolean;
  sound?: boolean;
  vibrate?: boolean;
  actions?: ToastAction[];
  onClose?: () => void;
  onUndo?: (() => void) | null;
  onRetry?: (() => void) | null;
  className?: string;
  style?: CSSProperties;
  groupId?: string;
  stackable?: boolean;
}

// Create a version for Required<ToastConfig> that handles null values
export interface RequiredToastConfig extends Omit<Required<ToastConfig>, 'onUndo' | 'onRetry'> {
  onUndo: (() => void) | null;
  onRetry: (() => void) | null;
}

export interface Toast {
  id: string;
  content: ReactNode;
  type: ToastType;
  config: RequiredToastConfig;
  timestamp: number;
  isExiting: boolean;
  isPaused: boolean;
  remainingTime: number;
  swipeProgress: number;
  retryCount: number;
}

export interface ToastQueue {
  maxToasts: number;
  strategy: 'fifo' | 'lifo' | 'priority';
  grouping: boolean;
  maxPerGroup: number;
}

export interface ToasterContextValue {
  toasts: Toast[];
  theme: ToastTheme;
  queue: ToastQueue;
  success: (content: ReactNode, config?: ToastConfig) => string;
  error: (content: ReactNode, config?: ToastConfig) => string;
  info: (content: ReactNode, config?: ToastConfig) => string;
  warning: (content: ReactNode, config?: ToastConfig) => string;
  loading: (content: ReactNode, config?: ToastConfig) => string;
  custom: (content: ReactNode, config?: ToastConfig) => string;
  update: (id: string, content: ReactNode, config?: Partial<ToastConfig>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  dismissGroup: (groupId: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  retry: (id: string) => void;
  undo: (id: string) => void;
  setTheme: (theme: ToastTheme) => void;
  setQueue: (queue: Partial<ToastQueue>) => void;
}

export interface ToasterProviderProps {
  children: ReactNode;
  theme?: ToastTheme;
  queue?: Partial<ToastQueue>;
  defaultConfig?: Partial<ToastConfig>;
  containerClassName?: string;
  newestOnTop?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  toastOptions?: {
    className?: string;
    style?: CSSProperties;
  };
}

export interface ToasterOptions {
  position?: ToastPosition;
  theme?: ToastTheme;
  duration?: number;
  richColors?: boolean;
  closeButton?: boolean;
  className?: string;
  style?: CSSProperties;
  onClose?: () => void;
}
