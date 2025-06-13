import { ToastPosition, ToastType } from '../types';

export const getAnimationClass = (position: ToastPosition, isExiting: boolean): string => {
  if (isExiting) {
    switch (position) {
      case 'top-right':
      case 'bottom-right':
        return 'animate-slide-out-right';
      case 'top-left':
      case 'bottom-left':
        return 'animate-slide-out-left';
      case 'top-center':
        return 'animate-slide-out-top';
      case 'bottom-center':
        return 'animate-slide-out-bottom';
      case 'center':
        return 'animate-fade-out';
      default:
        return 'animate-slide-out-right';
    }
  } else {
    switch (position) {
      case 'top-right':
      case 'bottom-right':
        return 'animate-slide-in-right';
      case 'top-left':
      case 'bottom-left':
        return 'animate-slide-in-left';
      case 'top-center':
        return 'animate-slide-in-top';
      case 'bottom-center':
        return 'animate-slide-in-bottom';
      case 'center':
        return 'animate-fade-in';
      default:
        return 'animate-slide-in-right';
    }
  }
};

export const getToastClasses = (type: ToastType): string => {
  const baseClasses = 'backdrop-blur-md border-0 shadow-2xl';

  switch (type) {
    case 'success':
      return `${baseClasses} bg-gradient-to-r from-emerald-50/90 via-green-50/90 to-emerald-50/90 border-l-4 border-l-emerald-500 text-emerald-900 shadow-emerald-500/20`;
    case 'error':
      return `${baseClasses} bg-gradient-to-r from-red-50/90 via-rose-50/90 to-red-50/90 border-l-4 border-l-red-500 text-red-900 shadow-red-500/20`;
    case 'info':
      return `${baseClasses} bg-gradient-to-r from-blue-50/90 via-cyan-50/90 to-blue-50/90 border-l-4 border-l-blue-500 text-blue-900 shadow-blue-500/20`;
    case 'warning':
      return `${baseClasses} bg-gradient-to-r from-amber-50/90 via-yellow-50/90 to-amber-50/90 border-l-4 border-l-amber-500 text-amber-900 shadow-amber-500/20`;
    case 'loading':
      return `${baseClasses} bg-gradient-to-r from-purple-50/90 via-indigo-50/90 to-purple-50/90 border-l-4 border-l-purple-500 text-purple-900 shadow-purple-500/20`;
    case 'custom':
      return `${baseClasses} bg-gradient-to-r from-gray-50/90 via-slate-50/90 to-gray-50/90 border-l-4 border-l-gray-500 text-gray-900 shadow-gray-500/20`;
    default:
      return `${baseClasses} bg-gradient-to-r from-gray-50/90 via-slate-50/90 to-gray-50/90 border-l-4 border-l-gray-500 text-gray-900 shadow-gray-500/20`;
  }
};
