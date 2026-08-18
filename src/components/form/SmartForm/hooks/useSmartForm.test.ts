import { act, renderHook } from "@testing-library/react";
import { FieldConfig } from "../../SmartField/types";
import { useSmartForm } from "./useSmartForm";

const fields: FieldConfig[] = [
  { id: "name", label: "Name", type: "text", required: true },
  { id: "subscribe", label: "Subscribe", type: "checkbox", required: true },
];

describe("useSmartForm", () => {
  it("derives the initial state from getInitialFormState when dataValue is not provided", () => {
    const { result } = renderHook(() =>
      useSmartForm({ fields, onSubmit: vi.fn() }),
    );

    expect(result.current.data).toEqual({ name: "", subscribe: false });
  });

  it("uses dataValue to override the initial state when provided", () => {
    const { result } = renderHook(() =>
      useSmartForm({
        fields,
        onSubmit: vi.fn(),
        dataValue: { name: "John", subscribe: true },
      }),
    );

    expect(result.current.data).toEqual({ name: "John", subscribe: true });
  });

  describe("disabled", () => {
    it("is false when neither formLoading nor the internal loading state is true", () => {
      const { result } = renderHook(() =>
        useSmartForm({ fields, onSubmit: vi.fn() }),
      );

      expect(result.current.disabled).toBe(false);
    });

    it("is true when formLoading is passed as true", () => {
      const { result } = renderHook(() =>
        useSmartForm({ fields, onSubmit: vi.fn(), loading: true }),
      );

      expect(result.current.disabled).toBe(true);
    });

    it("is true while the internal submit loading state is true", async () => {
      const nonRequiredFields: FieldConfig[] = [
        { id: "name", label: "Name", type: "text" },
      ];
      let resolveSubmit: () => void = () => {};
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          }),
      );
      const { result } = renderHook(() =>
        useSmartForm({ fields: nonRequiredFields, onSubmit }),
      );

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.disabled).toBe(true);

      await act(async () => {
        resolveSubmit();
        await Promise.resolve();
      });

      expect(result.current.disabled).toBe(false);
    });
  });

  it("forces required: false on every field in serializedFields", () => {
    const { result } = renderHook(() =>
      useSmartForm({ fields, onSubmit: vi.fn() }),
    );

    expect(result.current.serializedFields).toEqual([
      { ...fields[0], required: false },
      { ...fields[1], required: false },
    ]);
    expect(
      result.current.serializedFields.every((field) => field.required === false),
    ).toBe(true);
  });
});
