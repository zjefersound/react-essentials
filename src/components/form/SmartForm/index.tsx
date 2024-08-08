import { ISelectOption } from "../../../models/ISelectOption";
import { Button } from "../../ui/Button";
import { SmartField } from "../SmartField";
import { FieldConfig, FormFields } from "../SmartField/types";
import { useForm } from "./hooks/useForm";
import { getInitialFormState } from "./utils/getInitialFormState";
import { getValidator } from "./utils/getValidator";

export interface SmartFormProps {
  submitText: string;
  formOptions?: { [key: string]: ISelectOption[] };
  onSubmit: (payload: FormFields) => Promise<unknown>;
  fields: FieldConfig[];
}

export function SmartForm({
  submitText,
  onSubmit,
  fields,
  formOptions = {},
}: SmartFormProps) {
  const initialState = getInitialFormState(fields);

  const { data, errors, loading, handleChangeValue, handleSubmit } =
    useForm<FormFields>({
      initialState,
      onSubmit,
      validator: getValidator(fields),
    });

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <SmartField
          key={field.id}
          error={errors[field.id]}
          onChangeValue={handleChangeValue}
          value={data[field.id]}
          disabled={loading}
          config={{
            ...field,
            options: field.fetchOptionsFromApi
              ? formOptions[field.id]
              : field.options,
          }}
        />
      ))}
      <Button className="w-full justify-center">{submitText}</Button>
    </form>
  );
}
