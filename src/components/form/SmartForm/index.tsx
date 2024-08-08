import { ISelectOption } from "../../../models/ISelectOption";
import { Button } from "../../ui/Button";
import { Loading } from "../../ui/Loading";
import { SmartField } from "../SmartField";
import { FieldConfig, FormFields } from "../SmartField/types";
import { useForm } from "./hooks/useForm";
import { getInitialFormState } from "./utils/getInitialFormState";
import { getValidator } from "./utils/getValidator";

export interface SmartFormProps {
  submitText: string;
  loading?: boolean;
  formOptions?: { [key: string]: ISelectOption[] };
  onSubmit: (payload: FormFields) => Promise<unknown>;
  fields: FieldConfig[];
}

export function SmartForm({
  submitText,
  onSubmit,
  fields,
  loading: formLoading,
  formOptions = {},
}: SmartFormProps) {
  const initialState = getInitialFormState(fields);
  const { data, errors, loading, handleChangeValue, handleSubmit } =
    useForm<FormFields>({
      initialState,
      onSubmit,
      validator: getValidator(fields),
    });

  const disabled = formLoading || loading;
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <SmartField
          key={field.id}
          error={errors[field.id]}
          onChangeValue={handleChangeValue}
          value={data[field.id]}
          disabled={disabled}
          config={{
            ...field,
            required: false,
            options: field.fetchOptionsFromApi
              ? formOptions[field.id]
              : field.options,
          }}
        />
      ))}
      <Button className="w-full justify-center" disabled={disabled}>
        {loading && <Loading size="sm" className="mr-2" />}
        {submitText}
      </Button>
    </form>
  );
}
