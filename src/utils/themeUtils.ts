import { ToastType, ToastTheme } from '../types';

export const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    return 'light';
  }
};

export const getEffectiveTheme = (theme: ToastTheme): 'light' | 'dark' => {
  if (theme === 'auto') return detectSystemTheme();
  return theme;
};

export const getToastThemeClasses = (type: ToastType, theme: 'light' | 'dark'): string => {
  const baseClasses = 'backdrop-blur-xl border shadow-2xl transition-all duration-300';
  
  if (theme === 'dark') {
    switch (type) {
      case 'success':
        return `${baseClasses} bg-gradient-to-r from-emerald-900/90 via-green-900/90 to-emerald-900/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/25`;
      case 'error':
        return `${baseClasses} bg-gradient-to-r from-red-900/90 via-rose-900/90 to-red-900/90 border-red-500/50 text-red-100 shadow-red-500/25`;
      case 'info':
        return `${baseClasses} bg-gradient-to-r from-blue-900/90 via-cyan-900/90 to-blue-900/90 border-blue-500/50 text-blue-100 shadow-blue-500/25`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-amber-900/90 via-yellow-900/90 to-amber-900/90 border-amber-500/50 text-amber-100 shadow-amber-500/25`;
      case 'loading':
        return `${baseClasses} bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-purple-500/50 text-purple-100 shadow-purple-500/25`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-800/90 via-slate-800/90 to-gray-800/90 border-gray-600/50 text-gray-100 shadow-gray-500/25`;
    }
  } else {
    switch (type) {
      case 'success':
        return `${baseClasses} bg-gradient-to-r from-emerald-50/95 via-green-50/95 to-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/20`;
      case 'error':
        return `${baseClasses} bg-gradient-to-r from-red-50/95 via-rose-50/95 to-red-50/95 border-red-200 text-red-900 shadow-red-500/20`;
      case 'info':
        return `${baseClasses} bg-gradient-to-r from-blue-50/95 via-cyan-50/95 to-blue-50/95 border-blue-200 text-blue-900 shadow-blue-500/20`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-amber-50/95 via-yellow-50/95 to-amber-50/95 border-amber-200 text-amber-900 shadow-amber-500/20`;
      case 'loading':
        return `${baseClasses} bg-gradient-to-r from-purple-50/95 via-indigo-50/95 to-purple-50/95 border-purple-200 text-purple-900 shadow-purple-500/20`;
      default:
        return `${baseClasses} bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 border-gray-200 text-gray-900 shadow-gray-500/20`;
    }
  }
};

export const getActionButtonClasses = (style: 'primary' | 'secondary' | 'danger', theme: 'light' | 'dark'): string => {
  const baseClasses = 'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95';
  
  if (theme === 'dark') {
    switch (style) {
      case 'primary':
        return `${baseClasses} bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25`;
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25`;
      default:
        return `${baseClasses} bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-lg shadow-gray-700/25`;
    }
  } else {
    switch (style) {
      case 'primary':
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25`;
      case 'danger':
        return `${baseClasses} bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25`;
      default:
        return `${baseClasses} bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-lg shadow-gray-500/25`;
    }
  }
};
