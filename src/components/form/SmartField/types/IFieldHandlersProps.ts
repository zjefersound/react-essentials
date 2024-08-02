import { FormValue } from ".";

export interface IFieldHandlersProps {
  value: unknown;
  onChangeValue: (value: FormValue, id: string) => void;
  error?: string;
  disabled?: boolean;
}
