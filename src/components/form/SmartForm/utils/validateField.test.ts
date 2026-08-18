import { FieldConfig } from "../../SmartField/types";
import { FormFields } from "../types";
import { validateField } from "./validateField";

const baseField: FieldConfig = {
  id: "name",
  label: "Name",
  type: "text",
};

describe("validateField", () => {
  describe("required", () => {
    it("returns an error message when a required field is empty (empty string)", () => {
      const field: FieldConfig = { ...baseField, required: true };

      expect(validateField(field, "", {})).toBe("Name is required");
    });

    it("returns an error message when a required field is null", () => {
      const field: FieldConfig = { ...baseField, required: true };

      expect(validateField(field, null, {})).toBe("Name is required");
    });

    it("returns an error message when a required field is undefined", () => {
      const field: FieldConfig = { ...baseField, required: true };

      expect(validateField(field, undefined as unknown as FormFields[string], {})).toBe(
        "Name is required",
      );
    });

    it("does not treat 0 as an empty value in a required field", () => {
      const field: FieldConfig = {
        ...baseField,
        type: "number",
        required: true,
      };

      expect(validateField(field, 0, {})).toBeNull();
    });

    it("does not return an error when the field is not required and is empty", () => {
      const field: FieldConfig = { ...baseField, required: false };

      expect(validateField(field, "", {})).toBeNull();
    });
  });

  describe("custom validations", () => {
    it("returns the validation message when a custom rule fails", () => {
      const field: FieldConfig = {
        ...baseField,
        validations: [
          {
            rule: (value: string) => value.length >= 8,
            message: "Must be at least 8 characters",
          },
        ],
      };

      expect(validateField(field, "short", {})).toBe(
        "Must be at least 8 characters",
      );
    });

    it("returns the message of the first failing rule when multiple validations are defined", () => {
      const field: FieldConfig = {
        ...baseField,
        validations: [
          {
            rule: () => true,
            message: "First rule (passes)",
          },
          {
            rule: () => false,
            message: "Second rule (fails)",
          },
        ],
      };

      expect(validateField(field, "value", {})).toBe("Second rule (fails)");
    });

    it("receives the full values object so cross-field rules can be expressed", () => {
      const field: FieldConfig = {
        ...baseField,
        id: "confirmPassword",
        validations: [
          {
            rule: (value: string, values: FormFields) =>
              value === values.password,
            message: "Passwords must match",
          },
        ],
      };
      const values: FormFields = { password: "abc123", confirmPassword: "xyz" };

      expect(validateField(field, "xyz", values)).toBe(
        "Passwords must match",
      );
    });
  });

  describe("valid values", () => {
    it("returns null when the required field has a value", () => {
      const field: FieldConfig = { ...baseField, required: true };

      expect(validateField(field, "John", {})).toBeNull();
    });

    it("returns null when there are no validations and the field is not required", () => {
      expect(validateField(baseField, "anything", {})).toBeNull();
    });

    it("returns null when all custom validation rules pass", () => {
      const field: FieldConfig = {
        ...baseField,
        validations: [
          {
            rule: (value: string) => value.length >= 3,
            message: "Too short",
          },
        ],
      };

      expect(validateField(field, "valid value", {})).toBeNull();
    });
  });
});
