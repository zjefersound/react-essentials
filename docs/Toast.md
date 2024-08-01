# Toast

Toasts are UI resources used to send a feedback to the user after performing an action, such as creating, updating or deleting something.

## Get started

The Toast component is build using [Radix's primitive component](https://www.radix-ui.com/primitives/docs/components/toast). (You can change styles to fit your project.)

1. Install the dependency:
```bash
npm install @radix-ui/react-toast
```

2. Copy component from [`Toast.tsx`](../src/components/ui/Toast.tsx)

3. Copy context from [`ToastContext.tsx`](../src/contexts/ToastContext.tsx)

4. Copy hook from [`useToast.ts`](../src/hooks/useToast.ts)

5. Copy example from [`ToastExample.tsx`](../src/examples/ToastExample.tsx)

6. Copy animations to `tailwind.config.js`

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  ...
  theme: {
    ...
    extend: {
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [],
};
```

## Usage

1. Set the `ToastProvider` at the project's App component:

```typescript
// App.tsx (for example)
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <Routes /> // Adapt to you project
    </ToastProvider>
  );
}
```
2. `useToast`

To lauch a toast you can use the hook for a easier way of setting the toast props.

```typescript
import { useToast } from "../hooks/useToast";
...
const { launchToast } = useToast();
...

// You can do this, but you'll actually use with a real action first
const handleClick = () => launchToast({
  title: "Product created",
  description: "Product has been created successfully",
  color: "success",
  actionText: "Undo",
  onActionClick: () => alert('Undo create product'),
  duration: 1000,
});

return <button onClick={handleClick}>Click me</button>
```

3. Full Example
```typescript
// App.tsx
import { ToastProvider } from "./contexts/ToastContext";
// import ToastUsageExample from it's directory
export default function App() {
  return (
    <ToastProvider>
      <ToastUsageExample />
    </ToastProvider>
  );
}
```

```typescript
// Code from src/examples/ToastExample.tsx
function ToastUsageExample() {
  const { launchToast } = useToast();

  const handleCreateProduct = async () => {
    const createProduct = () => Promise.resolve(null);
    return createProduct().then(() => {
      launchToast({
        title: "Product created",
        description: "Product has been created successfully",
        color: "success",
        actionText: "Undo",
        onActionClick: () => alert('Undo create product'),
        duration: 1000,
      });
    });
  };

  return (
    <div className="flex h-dvh items-center justify-center">
      <Button onClick={handleCreateProduct}>Create product</Button>
    </div>
  );
}
```

## Recommendations

Save the toast messages in a separate json ou constant:

```typescript
export const TOAST_MESSAGES = {
  Product: {
    CREATED_TITLE: "Product created!",
    CREATED_DESCRIPTION: "Product has been created successfully.",
    CREATED_ERROR_TITLE: "Error createing product",
    UPDATED_TITLE: "Product updated!",
    UPDATED_DESCRIPTION: "Product updated successfully.",
    UPDATED_ERROR_TITLE: "Error updating product",
    DELETED_TITLE: "Product deleted successfully!",
    DELETED_DESCRIPTION: "Product was deleted.",
    DELETED_ERROR_TITLE: "Error deleting product",
  },
  COMMON: {
    ERROR_TITLE: "Unexpected error",
    ERROR_DESCRIPTION: "An unexpected error happened. Try again later.",
  },
};
```

then use it with lauchToast:
```typescript
// import TOAST_MESSAGES from it's directory 
...
launchToast({
  title: TOAST_MESSAGES.Product.CREATED_TITLE,
  description: TOAST_MESSAGES.Product.CREATED_DESCRIPTION,
  color: "success",
})
```
