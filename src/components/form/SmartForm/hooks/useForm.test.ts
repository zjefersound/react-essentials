import { act, renderHook } from "@testing-library/react";
import { IValidationReturn } from "../../../../models/IValidationReturn";
import { FormFields } from "../../SmartForm/types";
import { useForm } from "./useForm";

const validValidator = (): IValidationReturn => ({ isValid: true, errors: {} });
const invalidValidator = (errors: FormFields): IValidationReturn => ({
  isValid: false,
  errors: errors as ReturnType<typeof validValidator>["errors"],
});

describe("useForm", () => {
  describe("handleChangeValue", () => {
    it("updates data with the new value for the given field id", () => {
      const { result } = renderHook(() =>
        useForm<FormFields>({
          initialState: { name: "" },
          onSubmit: vi.fn(),
          validator: validValidator,
        }),
      );

      act(() => {
        result.current.handleChangeValue("John", "name");
      });

      expect(result.current.data.name).toBe("John");
    });

    it("clears the error of the field being changed", () => {
      const { result } = renderHook(() =>
        useForm<FormFields>({
          initialState: { name: "" },
          onSubmit: vi.fn(),
          validator: validValidator,
        }),
      );

      act(() => {
        result.current.setErrors({ name: "Name is required" });
      });
      expect(result.current.errors.name).toBe("Name is required");

      act(() => {
        result.current.handleChangeValue("John", "name");
      });

      expect(result.current.errors.name).toBeUndefined();
    });
  });

  describe("handleSubmit", () => {
    it("sets errors and does not call onSubmit when the validator returns isValid: false", () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<FormFields>({
          initialState: { name: "" },
          onSubmit,
          validator: () => invalidValidator({ name: "Name is required" }),
        }),
      );

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.errors).toEqual({ name: "Name is required" });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it("calls onSubmit with the current data and toggles loading while the validator is valid", async () => {
      let resolveSubmit: () => void = () => {};
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          }),
      );
      const { result } = renderHook(() =>
        useForm<FormFields>({
          initialState: { name: "John" },
          onSubmit,
          validator: validValidator,
        }),
      );

      act(() => {
        result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolveSubmit();
        await Promise.resolve();
      });

      expect(result.current.loading).toBe(false);
    });

    it("clears previous errors when the validator becomes valid", async () => {
      const onSubmit = vi.fn(() => Promise.resolve());
      const { result } = renderHook(() =>
        useForm<FormFields>({
          initialState: { name: "John" },
          onSubmit,
          validator: validValidator,
        }),
      );

      act(() => {
        result.current.setErrors({ name: "Name is required" });
      });

      await act(async () => {
        result.current.handleSubmit();
        await Promise.resolve();
      });

      expect(result.current.errors).toEqual({});
    });
  });
});
