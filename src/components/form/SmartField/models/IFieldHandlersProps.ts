import { IValidationError } from "../../../../models/IValidationReturn";

export interface IFieldHandlersProps {
  value: any;
  onChangeValue: (value: any, id: string) => void;
  errors: IValidationError[];
  disabled?: boolean;
}
