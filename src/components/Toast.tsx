import React, { useEffect, useState } from 'react';
import { Toast } from '../types';
import { getAnimationClass, getToastClasses } from '../utils/toastUtils';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, content, type, config, isExiting } = toast;
  const { position, duration } = config;
  const [progress, setProgress] = useState(100);
  
  // Get the animation class based on position and exit state
  const animationClass = getAnimationClass(position, isExiting);
  // Get the toast style classes based on type
  const toastClasses = getToastClasses(type);

  // Progress bar animation
  useEffect(() => {
    if (duration === Infinity || isExiting) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isExiting]);

  const getIcon = () => {
    const iconProps = "w-6 h-6 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return (
          <div className="p-1 bg-emerald-500 rounded-full">
            <svg className={`${iconProps} text-white`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="p-1 bg-red-500 rounded-full">
            <svg className={`${iconProps} text-white`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="p-1 bg-blue-500 rounded-full">
            <svg className={`${iconProps} text-white`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="p-1 bg-amber-500 rounded-full">
            <svg className={`${iconProps} text-white`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div
      className={`toast ${toastClasses} ${animationClass}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start w-full space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="text-sm font-semibold leading-5 mb-1">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
          <div className="text-sm leading-5 opacity-90">
            {content}
          </div>
        </div>
        
        {/* Close button */}
        <button
          type="button"
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/10 transition-colors duration-200 group"
          onClick={() => onDismiss(id)}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      {duration !== Infinity && !isExiting && (
        <div 
          className="toast-progress"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.1s linear'
          }}
        />
      )}
    </div>
  );
};

export default Toast;
