import { memo, useMemo } from "react";
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

const MemoizedSmartField = memo(SmartField);
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

  const disabled = useMemo(
    () => formLoading || loading,
    [formLoading, loading]
  );
  const serializedFields = useMemo(
    () => fields.map((config) => ({ ...config, required: false })),
    [fields]
  );
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {serializedFields.map((field) => (
        <MemoizedSmartField
          key={field.id}
          error={errors[field.id]}
          onChangeValue={handleChangeValue}
          value={data[field.id]}
          disabled={disabled}
          options={formOptions[field.id]}
          config={field}
        />
      ))}
      <Button className="w-full justify-center" disabled={disabled}>
        {loading && <Loading size="sm" className="mr-2" />}
        {submitText}
      </Button>
    </form>
  );
}
