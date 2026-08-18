import { FieldConfig } from "../../SmartField/types";
import { getValidator } from "./getValidator";

describe("getValidator", () => {
  it("returns isValid: true and an empty errors object when every field is valid", () => {
    const fields: FieldConfig[] = [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
    ];
    const validate = getValidator(fields);

    const result = validate({ name: "John", email: "john@example.com" });

    expect(result).toEqual({ isValid: true, errors: {} });
  });

  it("returns isValid: false and aggregates the error message of each invalid field", () => {
    const fields: FieldConfig[] = [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
    ];
    const validate = getValidator(fields);

    const result = validate({ name: "", email: "" });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      name: "Name is required",
      email: "Email is required",
    });
  });

  it("only includes entries in errors for fields that actually failed validation", () => {
    const fields: FieldConfig[] = [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
    ];
    const validate = getValidator(fields);

    const result = validate({ name: "John", email: "" });

    expect(result).toEqual({
      isValid: false,
      errors: { email: "Email is required" },
    });
  });

  it("returns isValid: true when the field list is empty", () => {
    const validate = getValidator([]);

    expect(validate({})).toEqual({ isValid: true, errors: {} });
  });

  it("applies custom validation rules through validateField for each field", () => {
    const fields: FieldConfig[] = [
      {
        id: "age",
        label: "Age",
        type: "number",
        validations: [
          {
            rule: (value: number) => value >= 18,
            message: "Must be an adult",
          },
        ],
      },
    ];
    const validate = getValidator(fields);

    const result = validate({ age: 16 });

    expect(result).toEqual({
      isValid: false,
      errors: { age: "Must be an adult" },
    });
  });
});
