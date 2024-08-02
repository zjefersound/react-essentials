import { FormControl } from "../FormControl";
import { TextInput } from "../TextInput";
import { Select } from "../Select";
import { IFieldHandlersProps } from "./types/IFieldHandlersProps";
import { FieldConfig } from "./types";
import { Textarea } from "../Textarea";
import { Checkbox } from "../Checkbox";
import { CheckLabel } from "../atoms/CheckLabel";
import { RadioGroup } from "../RadioGroup";
import { Slider } from "../Slider";
import clsx from "clsx";
import { FileInput, UploadedFile } from "../FileInput";

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
              name={config.id}
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
            name={config.id}
            value={value as string}
            onChange={(value) => onChangeValue(value, config.id)}
            placeholder={config.placeholder}
            disabled={disabled}
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
            disabled={disabled}
            onChange={(e) => onChangeValue(e.target.value, config.id)}
          />
        );
      case "checkboxList":
        return (
          <div className="space-y-2">
            {config.options &&
              config.options.map((option, index) => (
                <div key={index}>
                  <Checkbox
                    id={option.value}
                    name={config.id}
                    value={option.value}
                    checked={(value as string[]).includes(option.value)}
                    required={config.required}
                    onChange={() => {
                      const currentValues = value as string[];
                      const newValues = !(value as string[]).includes(
                        option.value
                      )
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);
                      onChangeValue(newValues, config.id);
                    }}
                    disabled={disabled}
                  />
                  <CheckLabel
                    htmlFor={option.value}
                    className={clsx({
                      "opacity-50 cursor-not-allowed": disabled,
                    })}
                  >
                    {option.label}
                  </CheckLabel>
                </div>
              ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup.Root
            id={config.id}
            value={value as string}
            name={config.id}
            onChange={(value) => onChangeValue(value, config.id)}
            disabled={disabled}
            required={config.required}
          >
            {config.options &&
              config.options.map((option) => (
                <RadioGroup.Item key={option.value} value={option.value}>
                  {option.label}
                </RadioGroup.Item>
              ))}
          </RadioGroup.Root>
        );
      case "checkbox":
        return (
          <div>
            <Checkbox
              id={config.id}
              name={config.id}
              checked={value as boolean}
              required={config.required}
              onChange={() => onChangeValue(!value, config.id)}
              disabled={disabled}
            />
            {"checkLabel" in config && (
              <CheckLabel
                htmlFor={config.id}
                className={clsx({
                  "opacity-50 cursor-not-allowed": disabled,
                })}
              >
                {config.checkLabel}
              </CheckLabel>
            )}
          </div>
        );
      case "file":
        return (
          <FileInput.Root>
            <FileInput.Dropzone className="h-[200px] w-[200px]">
              <FileInput.Input
                name={config.id}
                required={config.required}
                disabled={disabled}
                files={value ? ([value] as UploadedFile[]) : []}
                onFilesChange={(files) => onChangeValue(files[0], config.id)}
                allowedFileTypes={
                  "allowedFileTypes" in config
                    ? config.allowedFileTypes
                    : undefined
                }
                maxFileSize={
                  "maxFileSize" in config ? config.maxFileSize : undefined
                }
              />
              <FileInput.Preview
                visible={Boolean(value)}
                onRemove={() => onChangeValue(null, config.id)}
              >
                <FileInput.FilePreview file={value as UploadedFile} />
              </FileInput.Preview>
            </FileInput.Dropzone>
          </FileInput.Root>
        );
      case "files":
        return (
          <FileInput.Root>
            <FileInput.Dropzone>
              <FileInput.Input
                name={config.id}
                required={config.required}
                disabled={disabled}
                files={value as UploadedFile[]}
                onFilesChange={(files) => onChangeValue(files, config.id)}
                allowedFileTypes={
                  "allowedFileTypes" in config
                    ? config.allowedFileTypes
                    : undefined
                }
                maxFileSize={
                  "maxFileSize" in config ? config.maxFileSize : undefined
                }
              />
            </FileInput.Dropzone>
            <FileInput.List
              files={value as UploadedFile[]}
              onFilesChange={(files) => onChangeValue(files, config.id)}
            />
          </FileInput.Root>
        );
      case "slider":
        return (
          <Slider
            {...config}
            id={config.id}
            name={config.id}
            value={[value as number]}
            required={config.required}
            onChange={(v) => onChangeValue(v[0], config.id)}
            disabled={disabled}
          />
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
