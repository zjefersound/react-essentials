# SmartField

It's a generic form field that will support many different sorts of inputs. The main goal is to handle the data in the same way for all them.

[🔗 Beta version for tracking changes](https://github.com/joaozenaro/park-hub/pull/41)

⚠ This component is made to be used mainly with the ```SmartForm``` structure. If you have complex cases or want to use custom inputs, please use them separately without adding unecessary code.

(SmartForm is coming in future pull requests, will be linked here 🙂)

## How data should be handled?

For a form, the ideial way is to handle it as an object, for example: 
```tsx
const [data, setData] = useState({});
```

## Types:

### Handlers

Required props used to handle the form, such as setting the data, showing errors and preventing actions when disabled.

```tsx
interface IFieldHandlersProps {
  value: unknown;
  onChangeValue: (value: unknown, id: string) => void;
  errors: IValidationError[];
  disabled?: boolean;
}
```

### Field Props
 
This is what the inputs will receive. Note that the ```FieldProps``` is a type that accepts different interfaces for each supported input.

```tsx
// Until this moment this is what every field must have. May have newer upgrades after feedbacks
interface IBaseField {
  id: string;
  label: string;
}

// Example of how to type a text or password input
interface ITextField extends IBaseField {
  type: "text" | "password";
  required: boolean;
  placeholder: string;
  Icon?: IconType;
}


// Example of how to type a select input
interface ISelectField extends IBaseField {
  type: "select";
  required: boolean;
  placeholder: string;
  options: ISelectOption[];
}

// Field props will handle which props will be required based on the type
export type FieldProps = ITextField | ISelectField;
```

### How does it work? 🤯

```ts
interface ITextProps {
  type: "text";
  value: string;
}
interface INumberProps {
  type: "number";
  value: number;
}

type TextOrNumberProps = ITextProps | INumberProps;

// ✅ Works!
const myPropsAsText: TextOrNumberProps = {
  type: "text",
  value: "works fine!"
}
// ❌ Hold up bruh.
const myPropsAsTextWrong: TextOrNumberProps = {
  type: "text",
  value: 123 // gives error
}


// ✅ Works!
const myPropsAsNumber: TextOrNumberProps = {
  type: "text",
  value: 123 // works
}
// ❌ Hold up bruh.
const myPropsAsNumberWrong: TextOrNumberProps = {
  type: "text",
  value: "123??" // gives error
}
```