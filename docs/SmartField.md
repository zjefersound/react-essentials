# SmartField

It's a generic form field that will support many different sorts of inputs. The main goal is to handle the data in the same way for all them.

[🔗 Beta version for tracking changes](https://github.com/joaozenaro/park-hub/pull/41)

⚠ This component is made to be used mainly with the ```SmartForm``` structure. If you have complex cases or want to use custom inputs, please use them separately without adding unecessary code.

(SmartForm is coming in future pull requests, will be linked here 🙂)

## Get started

Wanna skip knowledge and code? Take a look at the [🔗 React Essentials Storybook](https://react-essentials-opal.vercel.app/) 

`Feeling curious? ☝🤓 Keep reading...`

## How data should be handled?

The ideal approach for handling form data is to treat it as an object, for example:

```tsx
const [data, setData] = useState({});
```

The data must be typed and have an initial value:

```tsx
interface MyForm {
  name: string;
  email: string;
}

const defaultData: MyForm = {
  name: "";
  email: "";
}
const [data, setData] = useState<MyForm>(defaultData);
```

Then to set a new value we will set a value updating a specific key from the object:

```tsx
const handleChangeValue = (value: unknown, id: string) => {
  setData(d => ({ ...d, [id]: value}))
}
```

Knowing that we can get started with the typings.

## Types:

### Handlers

These are the required props used to manage the form, including setting data, displaying errors, and preventing actions when disabled

```tsx
interface IFieldHandlersProps {
  value: unknown;
  onChangeValue: (value: unknown, id: string) => void;
  errors: IValidationError[];
  disabled?: boolean;
}
```

### Field Config
 
Contains the configuration for each field in the form, including type (text, select, radio, etc.), placeholder text, validation rules, and whether options are fetched from an API.

```tsx
export type FieldType =
  | "text"
  | "currency"
  | "email"
  | "password"
  // ... and others;

export type ValidationRule = {
  rule: (value: any) => boolean;
  message: string;
};

interface BaseFieldConfig {
  label: string;
  type: FieldType;
  id: string;
  options?: ISelectOption[];
  required?: boolean;
  fetchOptionsFromApi?: boolean;
  validations?: ValidationRule[];
  placeholder?: string;
}

interface FieldConfigWithIcon extends BaseFieldConfig {
  // Types that accepts Icon
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "currency"
    | "tel"
    | "url"
    | "time"
    | "date";
  Icon?: IconType;
}

// A field of type "currency" accepts Icon and other custom props
interface FieldConfigCurrency extends FieldConfigWithIcon { 
  type: "currency";
  locale: string;
  currency: string;
}

// FieldProps type determines the required props based on the input type
export type FieldConfig =
  | FieldConfigCurrency
  | FieldConfigWithIcon
  | BaseFieldConfig;
```

### Why does it work? 🤯

Example of how typescript handles types with different interfaces.

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

// ❌ Error example
const myPropsAsTextWrong: TextOrNumberProps = {
  type: "text",
  value: 123 // Error: value should be a string
}

// ✅ Works!
const myPropsAsNumber: TextOrNumberProps = {
  type: "number",
  value: 123 // works
}

// ❌ Error example
const myPropsAsNumberWrong: TextOrNumberProps = {
  type: "number",
  value: "123??" // Error: value should be a number
}

```