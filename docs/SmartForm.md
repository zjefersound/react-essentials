# Smart Form

The `SmartForm` component is a dynamic form builder that integrates with the `useSmartForm` hook. It simplifies form creation by automatically rendering fields based on the provided configuration and managing the form state.

## Get started

1. Install the required dependencies:

```bash
npm install <dependencies>
```
2. Install `SmartField` following the tutorial
3. Copy the everything from [`SmartForm`](../src/components/form/SmartForm/) (Including `hooks` and `utils`)

## Component

Description...

## Utility Functions

### `useSmartForm`
The useSmartForm hook wraps around the useForm hook to provide additional features tailored for the SmartForm component, such as handling loading states and serializing field configurations.

```ts
const formState = useSmartForm({
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter your name',
    },
    {
      id: 'state',
      label: 'State',
      type: 'select',
      fetchOptionsFromApi: true,
    },
    {
      id: 'city',
      label: 'City',
      type: 'select',
      fetchOptionsFromApi: true,
    },
  ],
  onSubmit: async (data) => {
    console.log('Form submitted:', data);
  },
});
```

## Usage

```tsx
<SmartForm
  submitText="Submit"
  formOptions={{
    state: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
    ],
    city: [
      { label: 'Los Angeles', value: 'LA' },
      { label: 'New York City', value: 'NYC' },
    ],
  }}
  formState={formState}
/>
```

## Recommendations

- Dynamic Options: Use the formOptions prop to dynamically load options for select fields based on API calls or other logic.

- Customization: Customize the SmartForm component to fit specific use cases by extending the FieldConfig type and adding new form fields or validation logic as needed.