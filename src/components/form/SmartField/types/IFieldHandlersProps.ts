import { FormValue } from ".";
import { ISelectOption } from "../../../../models/ISelectOption";

export interface IFieldHandlersProps {
  value: unknown;
  onChangeValue: (value: FormValue, id: string) => void;
  error?: string;
  disabled?: boolean;
  options?: ISelectOption[];
}
