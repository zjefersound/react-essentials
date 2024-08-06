import { SmartField } from "../SmartField";
import { FieldConfig, FormFields } from "../SmartField/types";
import { useForm } from "./hooks/useForm";
import { getInitialFormState } from "./utils/getInitialFormState";

export interface SmartFormProps {
  fields: FieldConfig[];
}

export function SmartForm({ fields }: SmartFormProps) {
  const initialState = getInitialFormState(fields);
  const { data, errors, loading, handleChangeValue } = useForm<FormFields>({
    initialState,
    onSubmit: async () => {},
    validator: () => {
      return { isValid: true, errors: {} };
    },
  });
  return (
    <>
      {fields.map((field) => (
        <SmartField
          key={field.id}
          error={errors[field.id]}
          onChangeValue={handleChangeValue}
          value={data[field.id]}
          disabled={loading}
          config={field}
        />
      ))}
    </>
  );
}
