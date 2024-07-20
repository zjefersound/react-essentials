import { IValidationError } from "../../../../models/IValidationReturn";

export interface IFieldHandlersProps {
  value: unknown;
  onChangeValue: (value: unknown, id: string) => void;
  errors: IValidationError[];
  disabled?: boolean;
}
