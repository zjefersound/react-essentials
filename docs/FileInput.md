# File Input

The `FileInput` component provides a custom file input solution, including drag-and-drop functionality, file previews, and file list management. It covers single and multi file input.

## Get started

The `FileInput.Preview` uses the `Slot` component to allow different types of previews (e.g., img, audio, video). 

1. Install the required dependency:

```bash
npm install @radix-ui/react-slot
```

2. Copy component from [`FileInput.tsx`](../src/components/form/FileInput.tsx)

3. Copy example from [`FileInputExample.tsx`](../src/examples/FileInputExample.tsx)

## Components

### FileInput.Root

The `FileInput.Root` component serves as the container for the entire file input system. It is responsible for wrapping all other components and ensuring consistent styling and layout.

```tsx
<FileInput.Root>
  {/* Other FileInput components go here */}
</FileInput.Root>
```

## FileInput.Dropzone

The `FileInput.Dropzone` component provides a drag-and-drop area where users can drop files to upload them. It includes styling and focus management to indicate the active state.

```tsx
<FileInput.Dropzone>
  <p>Drag & drop files here, or click to select files</p>
</FileInput.Dropzone>
```

## FileInput.Input

The `FileInput.Input` component is the main file input field, handling file selection, validation, and management. It supports drag-and-drop, manual file selection, and file size/type validation.

### API Reference:
|Property|Type|Description|
|---|---|---|
|`name`| string:| The name attribute for the input element.|
|`required`| boolean| Whether the input is required.|
|`disabled`| boolean| Whether the input is disabled.|
|`files`| `UploadedFile[]`| An array of uploaded file objects.|
|`onFilesChange`| function| Callback function when the file list changes.|
|`maxFileSize`| number| Maximum allowed file size in bytes.|
|`allowedFileTypes`| string[] | Array of allowed file MIME types.|

```tsx
<FileInput.Input
  name="file-upload"
  files={files}
  onFilesChange={setFiles}
  maxFileSize={10485760} // 10MB
  allowedFileTypes={['image/jpeg', 'image/png']}
/>
```

## FileInput.List

The `FileInput.List` component displays a list of selected files with details like file name and size. It also provides options to remove individual files.

```tsx
<FileInput.List
  files={files}
  onFilesChange={setFiles}
  onFileRemove={handleFileRemove}
/>
```

## FileInput.Preview

The `FileInput.Preview` component displays a preview of the selected file. It includes an overlay with a remove button to delete the file.

```tsx
<FileInput.Preview visible={Boolean(file)} onRemove={handleRemove}>
  <img src={file?.dataURL} alt={file?.name} />
</FileInput.Preview>
```

## FileInput.FilePreview

The `FileInput.FilePreview` component renders a preview of a file based on its type. It supports images, videos, and audio files, providing appropriate HTML elements for each type and a default view for unsupported file types.

```tsx
<FileInput.FilePreview file={file} />
```
## Utility Functions

### printFileSize
The printFileSize function formats a file size given in bytes into a human-readable string with appropriate units (e.g., KB, MB). It allows for specifying the number of decimal places to display.

```ts
console.log(printFileSize(10485760)) // Output: "10 MB"
console.log(printFileSize(12345678)) // Output: "11.77 MB"
console.log(printFileSize(1024, 0))  // Output: "1 KB"
```

## Usage

### Full example
```tsx
import React, { useState } from "react";
import { FileInput } from "./FileInput";

function App() {
  const [files, setFiles] = useState([]);

  return (
    <FileInput.Root>
      <FileInput.Dropzone>
        <FileInput.Input
          name="file-upload"
          files={files}
          onFilesChange={setFiles}
          maxFileSize={10485760}
          allowedFileTypes={["image/jpeg", "image/png"]}
        />
      </FileInput.Dropzone>
      <FileInput.List files={files} onFilesChange={setFiles} />
    </FileInput.Root>
  );
}

export default App;
```