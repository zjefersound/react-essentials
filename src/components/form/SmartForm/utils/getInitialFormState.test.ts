import { FieldConfig } from "../../SmartField/types";
import { getInitialFormState } from "./getInitialFormState";

const field = (overrides: Partial<FieldConfig>): FieldConfig =>
  ({
    id: "field",
    label: "Field",
    type: "text",
    ...overrides,
  }) as FieldConfig;

describe("getInitialFormState", () => {
  it.each([
    ["checkboxList", []],
    ["files", []],
  ] as const)("initializes %s fields with an empty array", (type, expected) => {
    const state = getInitialFormState([field({ id: "f", type })]);

    expect(state.f).toEqual(expected);
  });

  it("initializes range fields with a two-position array", () => {
    const state = getInitialFormState([field({ id: "f", type: "range" })]);

    expect(state.f).toEqual([0, 0]);
  });

  it("initializes file fields with null", () => {
    const state = getInitialFormState([field({ id: "f", type: "file" })]);

    expect(state.f).toBeNull();
  });

  it("initializes checkbox fields with false", () => {
    const state = getInitialFormState([field({ id: "f", type: "checkbox" })]);

    expect(state.f).toBe(false);
  });

  it("initializes currency fields with 0", () => {
    const state = getInitialFormState([field({ id: "f", type: "currency" })]);

    expect(state.f).toBe(0);
  });

  it("initializes slider fields with 0", () => {
    const state = getInitialFormState([field({ id: "f", type: "slider" })]);

    expect(state.f).toBe(0);
  });

  it("initializes color fields with #000000", () => {
    const state = getInitialFormState([field({ id: "f", type: "color" })]);

    expect(state.f).toBe("#000000");
  });

  it.each([
    "text",
    "email",
    "password",
    "number",
    "date",
    "time",
    "tel",
    "url",
    "select",
    "textarea",
    "radio",
  ] as const)("initializes %s fields (default case) with an empty string", (type) => {
    const state = getInitialFormState([field({ id: "f", type })]);

    expect(state.f).toBe("");
  });

  it("builds the initial state for every field in the list, keyed by field id", () => {
    const state = getInitialFormState([
      field({ id: "name", type: "text" }),
      field({ id: "subscribe", type: "checkbox" }),
      field({ id: "amount", type: "currency" }),
    ]);

    expect(state).toEqual({ name: "", subscribe: false, amount: 0 });
  });

  it("returns an empty object when the field list is empty", () => {
    expect(getInitialFormState([])).toEqual({});
  });
});
