import {
  FormErrors,
  IValidationReturn,
} from "../../../../models/IValidationReturn";
import { FormEvent, useState } from "react";
import { FormFields, FormValue } from "../../SmartField/types";

interface Props {
  initialState: FormFields;
  dataValue?: FormFields;
  onSubmit: (data: FormFields) => Promise<unknown>;
  validator: (data: FormFields) => IValidationReturn;
}
export function useForm<T = unknown>({
  initialState,
  dataValue,
  onSubmit,
  validator,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataValue || initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const handleChangeValue = (value: FormValue, id: string) => {
    setData((d: FormFields) => ({ ...d, [id]: value }));
    const newErrors = { ...errors };
    delete newErrors[id as keyof T];
    setErrors(newErrors);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const { isValid, errors: newErrors } = validator(data);

    if (!isValid) {
      setErrors(newErrors);
      setLoading(false);
    } else {
      setErrors({});
      onSubmit(data).finally(() => {
        setLoading(false);
      });
    }
  };

  return {
    data: data as T,
    setData,
    loading,
    setLoading,
    handleChangeValue,
    handleSubmit,
    errors,
    setErrors,
  };
}
