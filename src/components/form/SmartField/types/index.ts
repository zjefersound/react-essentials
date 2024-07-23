import { IconType } from "react-icons";
import { ISelectOption } from "../../../../models/ISelectOption";

export type FieldType =
  | "text"
  | "currency"
  | "email"
  | "password"
  | "number"
  | "date"
  | "radio"
  | "checkbox"
  | "select"
  | "textarea"
  | "file"
  | "range"
  | "color"
  | "time"
  | "tel"
  | "url"
  | "checkboxList";

export type ValidationRule = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface FieldConfigCheckbox extends BaseFieldConfig {
  type: "checkbox";
  checkLabel?: string;
}

interface FieldConfigCurrency extends FieldConfigWithIcon {
  type: "currency";
  locale: string;
  currency: string;
}
export type FieldConfig =
  | FieldConfigCheckbox
  | FieldConfigCurrency
  | FieldConfigWithIcon
  | BaseFieldConfig;

// will be moved to Smart Form folders
export interface FormFields {
  [key: string]: string | number | boolean | File | FileList | string[];
}
