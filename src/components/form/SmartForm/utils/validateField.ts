import { FieldConfig } from "../../SmartField/types";

export const validateField = (field: FieldConfig, value: any): string | null => {
  if (field.required && !value) {
    return `${field.label} is required`;
  }
  if (field.validations) {
    for (const validation of field.validations) {
      if (!validation.rule(value)) {
        return validation.message;
      }
    }
  }
  return null;
};