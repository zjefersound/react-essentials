import { FormFields } from "../components/form/SmartField/types";

export type FormErrors<T = FormFields> = {
  [K in keyof T]?: string;
};

export interface IValidationReturn<T = FormFields> {
  isValid: boolean;
  errors: FormErrors<T>;
}
