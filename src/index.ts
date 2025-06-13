// Import styles only in non-type-declaration builds
import './styles/index.css';

export { ToasterProvider } from './context/AdvancedToasterContext';
export { useToaster } from './hooks/useToaster';
export type { 
  ToastPosition, 
  ToastType, 
  ToastTheme,
  ToastPriority,
  Toast, 
  ToastConfig,
  ToastAction,
  SwipeConfig,
  ToasterOptions,
  ToasterProviderProps,
  ToasterContextValue
} from './types';

// Re-export legacy context for backward compatibility
export { ToasterProvider as SimpleToasterProvider } from './context/ToasterContext';
