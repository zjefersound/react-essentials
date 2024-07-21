import { FormControl } from "../FormControl";
import { TextInput } from "../TextInput";
import { Select } from "../Select";
import { IFieldHandlersProps } from "./types/IFieldHandlersProps";
import { FieldConfig } from "./types";
import { Textarea } from "../Textarea";

interface SmartFieldProps extends IFieldHandlersProps {
  config: FieldConfig;
}

export function SmartField({
  value,
  onChangeValue,
  disabled,
  errors,
  config,
}: SmartFieldProps) {
  const getField = () => {
    switch (config.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
      case "time":
      case "tel":
      case "color":
      case "url":
        return (
          <TextInput.Root>
            {"Icon" in config && config.Icon && (
              <TextInput.Icon>
                <config.Icon />
              </TextInput.Icon>
            )}
            <TextInput.Input
              name={config.id}
              value={value as string}
              onChange={(e) => onChangeValue(e.target.value, config.id)}
              placeholder={config.placeholder}
              disabled={disabled}
              required={config.required}
              type={config.type}
            />
          </TextInput.Root>
        );
      case "currency":
        return (
          <TextInput.Root>
            {"Icon" in config && config.Icon && (
              <TextInput.Icon>
                <config.Icon />
              </TextInput.Icon>
            )}
            <TextInput.CurrencyInput
              defaultValue={value as number}
              onChange={(value) => onChangeValue(value, config.id)}
              disabled={disabled}
              required={config.required}
            />
          </TextInput.Root>
        );
      case "select":
        return (
          <Select.Root
            value={value as string}
            onChange={(value) => onChangeValue(value, config.id)}
            placeholder={config.placeholder}
          >
            <Select.Item value={null as unknown as string}>
              {config.placeholder}
            </Select.Item>
            {config.options?.map((item) => (
              <Select.Item value={item.value} key={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Root>
        );
      case "textarea":
        return (
          <Textarea
            name={config.id}
            value={value as string}
            placeholder={config.placeholder}
            required={config.required}
            onChange={(e) => onChangeValue(e.target.value, config.id)}
          />
        );
      case "checkboxList":
        return (
          <div>
            {config.options &&
              config.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    name={config.id}
                    value={option.value}
                    checked={(value as string[]).includes(option.value)}
                    required={config.required}
                    onChange={(e) => {
                      const currentValues = value as string[];
                      const newValues = e.target.checked
                        ? [...currentValues, e.target.value]
                        : currentValues.filter((v) => v !== e.target.value);
                      onChangeValue(newValues, config.id);
                    }}
                  />
                  {option.label}
                </div>
              ))}
          </div>
        );
      case "radio":
        return (
          <div>
            {config.options &&
              config.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={config.id}
                    name={config.id}
                    value={option.value}
                    checked={value === option.value}
                    required={config.required}
                    onChange={(e) => onChangeValue(e.target.value, config.id)}
                  />
                  {option.label}
                </div>
              ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            <input
              type="checkbox"
              name={config.id}
              checked={value as boolean}
              required={config.required}
              onChange={(e) => onChangeValue(e.target.checked, config.id)}
            />
          </div>
        );
      case "file":
        return (
          <div>
            <input
              type="file"
              name={config.id}
              required={config.required}
              onChange={(e) => {
                onChangeValue(e.currentTarget.files, config.id);
              }}
            />
          </div>
        );
      case "range":
        return (
          <div>
            <input
              type="range"
              name={config.id}
              value={value as number}
              required={config.required}
              onChange={(e) => onChangeValue(e.target.value, config.id)}
            />
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <FormControl id={config.id} label={config.label} errors={errors}>
      {getField()}
    </FormControl>
  );
}
