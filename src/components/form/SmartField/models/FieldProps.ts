import { IconType } from "react-icons";
import { ISelectOption } from "../../../../models/ISelectOption";

interface IBaseField {
  id: string;
  label: string;
}

interface ITextField extends IBaseField {
  type: "text";
  required: boolean;
  placeholder: string;
  Icon?: IconType;
}

interface ISelectField extends IBaseField {
  type: "select";
  required: boolean;
  placeholder: string;
  options: ISelectOption[];
}

export type FieldProps = ITextField | ISelectField;
