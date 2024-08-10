import { memo } from "react";
import { ISelectOption } from "../../../models/ISelectOption";
import { Button } from "../../ui/Button";
import { Loading } from "../../ui/Loading";
import { SmartField } from "../SmartField";
import { FieldConfig, FormFields } from "../SmartField/types";
import { useSmartForm } from "./hooks/useSmartForm";

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
  const {
    data,
    errors,
    loading,
    handleChangeValue,
    handleSubmit,
    serializedFields,
    disabled,
  } = useSmartForm({ onSubmit, fields, loading: formLoading });
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
