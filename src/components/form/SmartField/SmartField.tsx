import { FormControl } from "../FormControl";
import { TextInput } from "../TextInput";
import { Select } from "../Select";
import { IFieldHandlersProps } from "./models/IFieldHandlersProps";
import { FieldProps } from "./models/FieldProps";

interface SmartFieldProps extends IFieldHandlersProps {
  field: FieldProps;
}

export default function SmartField({
  value,
  onChangeValue,
  disabled,
  errors,
  field,
}: SmartFieldProps) {
  return (
    <FormControl id={field.id} label={field.label} errors={errors}>
      {field.type === "text" && (
        <TextInput.Root>
          {field.Icon && (
            <TextInput.Icon>
              <field.Icon />
            </TextInput.Icon>
          )}
          <TextInput.Input
            value={value}
            onChange={(e) => onChangeValue(e.target.value, field.id)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.required}
            type={field.type}
          />
        </TextInput.Root>
      )}
      {field.type === "select" && (
        <Select.Root
          value={value}
          onChange={(value) => onChangeValue(value, field.id)}
          placeholder={field.placeholder}
        >
          <Select.Item value={null as unknown as string}>
            {field.placeholder}
          </Select.Item>
          {field.options.map((item) => (
            <Select.Item value={item.value} key={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Root>
      )}
    </FormControl>
  );
}
