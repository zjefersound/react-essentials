# SmartField

The `SmartField` is a generic form field that will support many different sorts of inputs. The main goal is to handle the data in the same way for all them.

[🔗 Beta version for tracking changes](https://github.com/joaozenaro/park-hub/pull/41)

⚠ This component is made to be used mainly with the [`SmartForm`](./SmartForm.md) structure. If you have complex cases or want to use custom inputs, please use them separately without adding unecessary code.

## Get started

1. Install the required dependencies:

```bash
npm install clsx react-icons @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-slot
```
2. Copy everything from [`SmartField`](../src/components/form/SmartField/)
3. Copy your desired components from [`components/form`](../src/components/form) and remove from SmartField if needed
4. Copy [`models/ISelectOption.ts`](../src/models/ISelectOption.ts)
5. Copy [`models/IValidationReturn.ts`](../src/models/IValidationReturn.ts)
6. Copy [`models/semanticColor.ts`](../src/models/semanticColor.ts)
7. Copy [`utils/printFileSize.ts`](../src/utils/printFileSize.ts)
8. Copy [`utils/toCurrency.ts`](../src/utils/toCurrency.ts)
9. Copy example from [`SmartFieldExamples.tsx`](../src/examples/SmartFieldExamples.tsx)

## Usage 

### Field Config

The field config type will help with autocomplete.

```tsx
const formFields: FieldConfig[] = [
  {
    label: "Name",
    type: "text",
    id: "name",
    required: true,
    placeholder: "Enter your name",
    validations: [
      { rule: (value) => value.trim() !== "", message: "Name is required" },
    ],
  },
  {
    label: "Amount",
    type: "currency",
    id: "amount",
    required: true,
    placeholder: "Enter the amount",
    currency: "USD",
    locale: "en-US",
  },
];
```
### Full Example
```tsx
import { SmartField } from "./SmartField";
import { useSmartForm } from "../hooks/useSmartForm";

const MyForm = () => {
  const { formState, handleFieldChange } = useSmartForm({
    initialValues: {
      myField: "",
    },
  });

  const config = {
    id: "myField",
    type: "text",
    label: "My Field",
    placeholder: "Enter text",
    required: true,
  };

  return (
    <form>
      <SmartField
        config={config}
        value={formState.myField}
        onChangeValue={handleFieldChange}
      />
    </form>
  );
};
```