# `useForm` Hook Documentation

## Overview

The `useForm` hook is a custom React hook designed to simplify the management of form state, validation, and submission. It provides an easy-to-use interface for handling form data, loading states, and error management.

## Hook Parameters

**`initialState` (`FormFields`):** This parameter sets the initial values for the form fields. It is an object where each key corresponds to a form field name, and the value is the initial value of that field.

**`dataValue?` (`FormFields`, optional):** This optional parameter allows you to provide predefined form data that will override the initialState. It is useful when you want to pre-fill a form with existing data, such as when editing an entity.

**`onSubmit` (`(data: FormFields) => Promise<unknown>`):** A function that handles the form submission. It receives the current form data as an argument and is expected to return a promise, typically representing an asynchronous operation like an API call.

**`validator` (`(data: FormFields) => IValidationReturn`):** A function responsible for validating the form data. It should return an object containing two properties: isValid (a boolean indicating whether the form is valid) and errors (an object representing the validation errors for each form field).

## Return Values
The useForm hook returns an object with several properties that facilitate form management:

- `data`: T: Holds the current form data.

- `loading`: boolean: Indicates if the form is submitting.

- `handleChangeValue(value: FormValue, id: string): void`: Updates a specific form field’s value and clears its error.

- `handleSubmit(e?: FormEvent)`: void: Manages form submission, including validation and calling onSubmit if valid.

- `errors`: `FormErrors<T>`: Contains validation errors for each form field.

- `setErrors(errors: FormErrors): void`: Manually sets form errors.

## Usage 

```tsx
function MyFormComponent() {
  const {
    data,
    loading,
    handleChangeValue,
    handleSubmit,
    errors,
  } = useForm({
    initialState: { name: '', age: 0 },
    onSubmit: async (formData) => {
      // Handle form submission, e.g., send data to an API
    },
    validator: (formData) => {
      const errors: FormErrors = {};
      if (!formData.name) errors.name = 'Name is required';
      if (formData.age <= 0) errors.age = 'Age must be greater than zero';
      return { isValid: Object.keys(errors).length === 0, errors };
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={data.name}
        onChange={(e) => handleChangeValue(e.target.value, 'name')}
      />
      <input
        type="number"
        value={data.age}
        onChange={(e) => handleChangeValue(Number(e.target.value), 'age')}
      />
      <button type="submit" disabled={loading}>
        Submit
      </button>
      {errors.name && <span>{errors.name}</span>}
      {errors.age && <span>{errors.age}</span>}
    </form>
  );
}
```