# @abisheks238/react-toaster

[![npm version](https://badge.fury.io/js/@abisheks238%2Freact-toaster.svg)](https://badge.fury.io/js/@abisheks238%2Freact-toaster)
[![npm downloads](https://img.shields.io/npm/dm/@abisheks238/react-toaster.svg)](https://www.npmjs.com/package/@abisheks238/react-toaster)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ABISHEK-K-DEV/react-toaster/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ABISHEK-K-DEV/react-toaster.svg)](https://github.com/ABISHEK-K-DEV/react-toaster/stargazers)

An advanced, customizable toast notification system for React applications with smart queue management, swipe gestures, and theming support.

## 🚀 Features

- 🌈 **Multiple toast types**: success, error, info, warning, loading, custom
- 🎨 **Theming support**: Light, dark, and auto themes
- 📱 **Swipe gestures**: Dismiss toasts with swipe actions
- 🔄 **Smart queue management**: Priority-based toast handling
- 📍 **Flexible positioning**: 7 different positions available
- ⏱️ **Auto-dismiss**: Customizable duration with pause on hover
- 🎯 **Action buttons**: Add custom actions to toasts
- 🔊 **Sound & Vibration**: Optional audio and haptic feedback
- 🧩 **Fully typed**: Complete TypeScript support
- 🎭 **Animations**: Smooth enter/exit animations
- 📦 **Lightweight**: Minimal bundle size

## 📦 Installation

```bash
# npm
npm install @abisheks238/react-toaster

# yarn
yarn add @abisheks238/react-toaster

# pnpm
pnpm add @abisheks238/react-toaster
```

## 🔗 Links

- [📦 NPM Package](https://www.npmjs.com/package/@abisheks238/react-toaster)
- [📚 GitHub Repository](https://github.com/ABISHEK-K-DEV/react-toaster)
- [🐛 Report Issues](https://github.com/ABISHEK-K-DEV/react-toaster/issues)
- [💡 Feature Requests](https://github.com/ABISHEK-K-DEV/react-toaster/issues/new)

## 🚀 Quick Start

### 1. Wrap your application with ToasterProvider

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToasterProvider } from '@abisheks238/react-toaster';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToasterProvider theme="auto" position="top-right">
      <App />
    </ToasterProvider>
  </React.StrictMode>
);
```

### 2. Use the toaster in your components

```tsx
import React from 'react';
import { useToaster } from '@abisheks238/react-toaster';

function MyComponent() {
  const { success, error, info, warning, loading } = useToaster();
  
  return (
    <div>
      <button onClick={() => success('Operation successful!')}>
        Show Success Toast
      </button>
      
      <button onClick={() => error('Something went wrong.')}>
        Show Error Toast
      </button>
      
      <button onClick={() => info('Here is some information.')}>
        Show Info Toast
      </button>
      
      <button onClick={() => warning('Proceed with caution!')}>
        Show Warning Toast
      </button>
      
      <button onClick={() => loading('Processing...')}>
        Show Loading Toast
      </button>
      
      {/* Advanced usage with actions */}
      <button 
        onClick={() => 
          error('Failed to save changes', {
            position: 'bottom-center',
            duration: 10000,
            actions: [
              {
                label: 'Retry',
                onClick: (id) => console.log('Retry clicked', id),
                style: 'primary'
              },
              {
                label: 'Cancel',
                onClick: (id) => console.log('Cancel clicked', id),
                style: 'secondary'
              }
            ],
            onRetry: () => console.log('Retry action triggered'),
            sound: true,
            vibrate: true
          })
        }
      >
        Advanced Toast
      </button>
    </div>
  );
}
```

## 📖 API Reference

### ToasterProvider Props

```tsx
interface ToasterProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark' | 'auto'; // Default: 'auto'
  queue?: {
    maxToasts?: number; // Default: 5
    strategy?: 'fifo' | 'lifo' | 'priority'; // Default: 'fifo'
    grouping?: boolean; // Default: false
    maxPerGroup?: number; // Default: 3
  };
  defaultConfig?: Partial<ToastConfig>;
  containerClassName?: string;
  newestOnTop?: boolean; // Default: true
  richColors?: boolean; // Default: true
  closeButton?: boolean; // Default: true
}
```

### useToaster Hook

```tsx
const {
  success,
  error,
  info,
  warning,
  loading,
  custom,
  update,
  dismiss,
  dismissAll,
  dismissGroup,
  pause,
  resume,
  retry,
  undo,
  setTheme,
  setQueue
} = useToaster();
```

### Toast Configuration Options

```tsx
interface ToastConfig {
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';
  duration?: number; // milliseconds (default: 5000, use Infinity for persistent)
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dismissible?: boolean; // Default: true
  pauseOnHover?: boolean; // Default: true
  pauseOnFocusLoss?: boolean; // Default: true
  swipe?: {
    enabled: boolean; // Default: true
    threshold: number; // Default: 100
    velocity: number; // Default: 0.3
  };
  icon?: ReactNode | boolean; // Default: true
  sound?: boolean; // Default: false
  vibrate?: boolean; // Default: false
  actions?: ToastAction[];
  onClose?: () => void;
  onUndo?: () => void;
  onRetry?: () => void;
  className?: string;
  style?: CSSProperties;
  groupId?: string;
  stackable?: boolean;
}
```

## 🎨 Theming

The toaster automatically adapts to your system's color scheme when using `theme="auto"`. You can also force light or dark themes:

```tsx
<ToasterProvider theme="dark">
  <App />
</ToasterProvider>

// Or change theme dynamically
const { setTheme } = useToaster();
setTheme('light');
```

## 🎭 Advanced Features

### Queue Management

```tsx
const { setQueue } = useToaster();

// Configure queue behavior
setQueue({
  maxToasts: 3,
  strategy: 'priority', // Show high priority toasts first
  grouping: true, // Group similar toasts
  maxPerGroup: 2
});
```

### Custom Actions

```tsx
success('File uploaded successfully!', {
  actions: [
    {
      label: 'View File',
      onClick: (id) => openFile(),
      style: 'primary'
    },
    {
      label: 'Share',
      onClick: (id) => shareFile(),
      style: 'secondary'
    }
  ],
  onUndo: () => deleteFile() // Undo action
});
```

### Swipe Gestures

```tsx
info('Swipe me away!', {
  swipe: {
    enabled: true,
    threshold: 150, // Pixels to trigger dismiss
    velocity: 0.5   // Minimum swipe velocity
  }
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/ABISHEK-K-DEV/react-toaster/blob/main/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ABISHEK-K-DEV/react-toaster/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Abishek](https://github.com/ABISHEK-K-DEV)
- Inspired by modern toast notification patterns
- Powered by React and TypeScript

---

**Made with ❤️ for the React community**

[![NPM](https://nodei.co/npm/@abisheks238/react-toaster.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@abisheks238/react-toaster)
