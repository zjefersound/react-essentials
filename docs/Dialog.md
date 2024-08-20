
# Dialog

The `Dialog` component is a customizable modal dialog built with Radix UI's `@radix-ui/react-dialog`. It provides a flexible and accessible solution for creating modal dialogs with various sizes, and includes functionality for managing open/close states.

## Get started

To use the `Dialog` component, ensure you have the required dependencies installed.

1. Install the required dependency:

```bash
npm install @radix-ui/react-dialog
```

2. Copy the `Dialog` component from the [`Dialog.tsx`](../src/components/ui/Dialog.tsx) file.

3. Add the animations called `contentShow` as in [`tailwind.config.js`](../tailwind.config.js)

## Components

### Dialog.Root

The `Dialog.Root` component serves as the root container for the dialog. It manages the open/close state and wraps the dialog's trigger and content.

```tsx
<Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
  {/* Other Dialog components go here */}
</Dialog.Root>
```

#### Props

| Property       | Type                 | Description                                         |
|----------------|----------------------|-----------------------------------------------------|
| `children`     | `ReactNode`          | Elements to render inside the dialog.               |
| `onOpenChange` | `(open: boolean) => void` | Callback function triggered when the open state changes. |
| `open`         | `boolean`            | Controls whether the dialog is open or closed.      |

### Dialog.Trigger

The `Dialog.Trigger` component wraps the element that triggers the opening of the dialog. It leverages the `asChild` feature from Radix UI to render the trigger element as a child.

```tsx
<Dialog.Trigger>
  <button>Open Dialog</button>
</Dialog.Trigger>
```

#### Props

| Property       | Type         | Description                              |
|----------------|--------------|------------------------------------------|
| `children`     | `ReactNode`  | The element that triggers the dialog.    |

### Dialog.Content

The `Dialog.Content` component is the main content area of the dialog. It includes the dialog's title, description, and a close button. It also supports various sizes.

```tsx
<Dialog.Content title="Dialog Title" description="This is a dialog description." size="md">
  <p>Dialog content goes here.</p>
</Dialog.Content>
```

#### Props

| Property       | Type         | Description                              |
|----------------|--------------|------------------------------------------|
| `title`        | `string`     | The title displayed in the dialog.       |
| `description`  | `string`     | A brief description of the dialog.       |
| `children`     | `ReactNode`  | Elements to render inside the dialog.    |
| `size` | `"sm" \| "md" \| "lg"` | Controls the size of the dialog content area. |

## Usage

### Full example

```tsx
import React, { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        title="Sample Dialog"
        description="This is a sample dialog."
        size="md"
      >
        <p>Here is some content inside the dialog.</p>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default App;
```
