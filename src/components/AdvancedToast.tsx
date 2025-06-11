import React, { useEffect, useState, useRef } from 'react';
import { Toast as ToastType, ToastTheme } from '../types';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { getToastThemeClasses, getActionButtonClasses, getEffectiveTheme } from '../utils/themeUtils';

interface AdvancedToastProps {
  toast: ToastType;
  theme: ToastTheme;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onUndo: (id: string) => void;
  onRetry: (id: string) => void;
}

const AdvancedToast: React.FC<AdvancedToastProps> = ({
  toast,
  theme,
  onDismiss,
  onPause,
  onResume,
  onUndo,
  onRetry,
}) => {
  const { id, content, type, config, isExiting, isPaused, remainingTime } = toast;
  const [progress, setProgress] = useState(100);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(100);
  
  const effectiveTheme = getEffectiveTheme(theme);
  const themeClasses = getToastThemeClasses(type, effectiveTheme);

  // Swipe gesture handling
  const { touchHandlers, mouseHandlers } = useSwipeGesture(
    config.swipe,
    {
      onSwipeStart: () => {
        setIsDragging(true);
        if (config.pauseOnHover) onPause(id);
      },
      onSwipeMove: (progress, e) => {
        try {
          const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
          const rect = toastRef.current?.getBoundingClientRect();
          if (rect && clientX !== undefined) {
            const offset = clientX - rect.left - rect.width / 2;
            setSwipeOffset(offset);
          }
        } catch (error) {
          // Handle potential measurement errors
          setSwipeOffset(0);
        }
      },
      onSwipeEnd: (dismissed) => {
        setIsDragging(false);
        if (dismissed) {
          onDismiss(id);
        } else {
          setSwipeOffset(0);
          if (config.pauseOnHover) onResume(id);
        }
      }
    }
  );

  // Progress bar animation
  useEffect(() => {
    if (config.duration === Infinity || isExiting || isPaused) return;
    
    const interval = setInterval(() => {
      const newProgress = progressRef.current - (100 / (config.duration / 100));
      progressRef.current = newProgress <= 0 ? 0 : newProgress;
      setProgress(progressRef.current);
      
      if (progressRef.current <= 0) {
        onDismiss(id);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [config.duration, isExiting, isPaused, id, onDismiss]);

  // Pause/resume on hover
  useEffect(() => {
    if (config.pauseOnHover) {
      if (isHovered && !isPaused) {
        onPause(id);
      } else if (!isHovered && isPaused) {
        onResume(id);
      }
    }
  }, [isHovered, config.pauseOnHover, isPaused, id, onPause, onResume]);

  const getIcon = () => {
    const iconClasses = "w-5 h-5 flex-shrink-0";
    
    if (config.icon === false) return null;
    if (React.isValidElement(config.icon)) return config.icon;

    switch (type) {
      case 'success':
        return (
          <div className="p-1.5 bg-emerald-500 rounded-full">
            <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="p-1.5 bg-red-500 rounded-full">
            <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="p-1.5 bg-blue-500 rounded-full">
            <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="p-1.5 bg-amber-500 rounded-full">
            <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'loading':
        return (
          <div className="p-1.5 bg-purple-500 rounded-full">
            <svg className={`${iconClasses} text-white animate-spin`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (!config.actions?.length && !config.onUndo && !config.onRetry) return null;

    return (
      <div className="flex items-center space-x-2 mt-3">
        {config.onUndo && typeof config.onUndo === 'function' && (
          <button
            onClick={() => onUndo(id)}
            className={getActionButtonClasses('secondary', effectiveTheme)}
          >
            Undo
          </button>
        )}
        {config.onRetry && typeof config.onRetry === 'function' && (
          <button
            onClick={() => onRetry(id)}
            className={getActionButtonClasses('primary', effectiveTheme)}
          >
            Retry
          </button>
        )}
        {config.actions?.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick(id)}
            disabled={action.loading}
            className={getActionButtonClasses(action.style || 'secondary', effectiveTheme)}
          >
            {action.loading ? (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              action.label
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={toastRef}
      className={`
        toast ${themeClasses} 
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${config.className || ''}
      `}
      style={{
        transform: `translateX(${swipeOffset}px) ${isDragging ? 'rotate(2deg)' : ''}`,
        opacity: isDragging ? Math.max(0.3, 1 - Math.abs(swipeOffset) / 200) : 1,
        ...config.style,
      }}
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...touchHandlers}
      {...(mouseHandlers as any)}
    >
      <div className="flex items-start w-full space-x-4">
        {/* Icon */}
        {getIcon() && (
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="text-sm font-semibold leading-5 mb-1 capitalize">
            {type === 'custom' ? 'Notification' : type}
          </div>
          <div className="text-sm leading-5 opacity-90">
            {content}
          </div>
          {renderActions()}
        </div>
        
        {/* Close button */}
        {config.dismissible && (
          <button
            type="button"
            className="flex-shrink-0 ml-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 group"
            onClick={() => onDismiss(id)}
            aria-label="Close notification"
          >
            <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Progress bar */}
      {config.duration !== Infinity && !isExiting && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Swipe indicator */}
      {isDragging && Math.abs(swipeOffset) > 50 && (
        <div className={`absolute top-1/2 transform -translate-y-1/2 ${swipeOffset > 0 ? 'right-4' : 'left-4'}`}>
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AdvancedToast;
