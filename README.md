# @abisheks238/react-toaster

A customizable, lightweight toast notification system for React applications.

## Features

- 🌈 Multiple toast types: success, error, info, warning
- 🔄 Auto-dismiss with customizable duration
- 📍 Flexible positioning (top-right, bottom-left, etc.)
- 🎨 Styled with Tailwind CSS
- 🪝 Simple hook-based API
- 🧩 Fully typed with TypeScript

## Installation

```bash
# npm
npm install @abisheks238/react-toaster

# yarn
yarn add @abisheks238/react-toaster

# pnpm
pnpm add @abisheks238/react-toaster
```

## Usage

### 1. Wrap your application with ToasterProvider

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToasterProvider } from '@abisheks238/react-toaster';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToasterProvider>
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
  const { success, error, info, warning } = useToaster();
  
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
      
      {/* With custom options */}
      <button 
        onClick={() => 
          success('Positioned at bottom-center and stays for 10 seconds', {
            position: 'bottom-center',
            duration: 10000
          })
        }
      >
        Custom Toast
      </button>
    </div>
  );
}
```

## API

### ToasterProvider

Wrap your application with the `ToasterProvider` to enable the toast functionality.

```tsx
<ToasterProvider>
  <App />
</ToasterProvider>
```

### useToaster

A hook that provides functions to display toasts.

```tsx
const {
  success,
  error,
  info,
  warning,
  dismiss,
  dismissAll
} = useToaster();
```

#### Toast Functions

Each function returns the ID of the created toast.

- `success(content, options?)` - Display a success toast
- `error(content, options?)` - Display an error toast
- `info(content, options?)` - Display an info toast
- `warning(content, options?)` - Display a warning toast

#### Management Functions

- `dismiss(id)` - Dismiss a specific toast by ID
- `dismissAll()` - Dismiss all toasts

#### Options

```ts
interface ToasterOptions {
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  duration?: number; // milliseconds (default: 5000, use Infinity to prevent auto-dismiss)
  onClose?: () => void; // Callback when toast is closed
}
```

## Example

```tsx
import React from 'react';
import { useToaster } from '@abisheks238/react-toaster';

function ToastDemo() {
  const { success, error, info, warning, dismissAll } = useToaster();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Toast Demo</h1>
      
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => 
            success('Success message!', {
              position: 'top-right',
              duration: 5000,
              onClose: () => console.log('Success toast closed')
            })
          }
        >
          Success
        </button>
        
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => error('Error occurred!')}
        >
          Error
        </button>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => info('Information!')}
        >
          Info
        </button>
        
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => warning('Warning!')}
        >
          Warning
        </button>
        
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={dismissAll}
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
}

export default ToastDemo;
```

## License

MIT
