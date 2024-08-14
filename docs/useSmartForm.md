# `useSmartForm` Hook Documentation

## Overview

The `useSmartForm` hook is an extension of the `useForm` hook, specifically designed to work with the `SmartForm` component. It integrates form state management, validation, and additional logic.

## Hook Parameters

**`onSubmit ((payload: FormFields) => Promise<unknown>)`**: The function that handles form submission. It receives the form data as a parameter and should return a promise.

**`fields (FieldConfig[])`**: An array of field configurations that define the structure and validation rules of the form fields. Each field in the array is described by a FieldConfig object.

**`loading? (boolean, optional)`**: A boolean that represents the loading state of the form. This can be used to disable the form while an external process (like data fetching) is ongoing.

## Return Values
The useSmartForm hook returns an object with the following properties:

- `data: T`: Holds the current state of the form data.

- `errors: FormErrors<T>`: Contains validation errors for the form fields.

- `loading: boolean`: Indicates if the form is currently in the submission process.

- `handleChangeValue(value: FormValue, id: string): void`: Updates a specific form field's value and clears its validation error.

- `handleSubmit(e?: FormEvent): void`: Manages form submission, including validation and calling the onSubmit function if the form is valid.

- `disabled: boolean`: A boolean that indicates whether the form should be disabled. This is derived from the loading state or an external loading flag passed as a prop.

- `serializedFields: FieldConfig[]`: An array of field configurations, with each field marked as not required.

## Usage 

```tsx
import { useSmartForm } from 'path-to-useSmartForm';

function MyComponent() {
  const {
    data,
    errors,
    loading,
    handleChangeValue,
    handleSubmit,
    disabled,
    serializedFields,
  } = useSmartForm({
    onSubmit: async (formData) => {
      // Handle form submission, e.g., send data to an API
    },
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'age', label: 'Age', type: 'number', required: true },
    ],
    loading: false,
  });

  return (
    <form onSubmit={handleSubmit}>
      {serializedFields.map((field) => (
        <input
          key={field.id}
          type={field.type}
          value={data[field.id]}
          onChange={(e) => handleChangeValue(e.target.value, field.id)}
          disabled={disabled}
        />
      ))}
      <button type="submit" disabled={disabled || loading}>
        Submit
      </button>
      {errors.name && <span>{errors.name}</span>}
      {errors.age && <span>{errors.age}</span>}
    </form>
  );
}
```