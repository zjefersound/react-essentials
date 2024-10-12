import { render, fireEvent } from "@testing-library/react";
import { TextInput } from "./TextInput";
describe("TextInput.Root", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <TextInput.Root>
        <div>Test Content</div>
      </TextInput.Root>
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom borderColor and className", () => {
    const { container } = render(
      <TextInput.Root borderColor="danger" className="custom-class">
        <div>Test Content</div>
      </TextInput.Root>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("TextInput.Icon", () => {
  it("renders the icon inside the slot", () => {
    const { getByText } = render(
      <TextInput.Icon>
        <span>Icon</span>
      </TextInput.Icon>
    );

    expect(getByText("Icon")).toBeInTheDocument();
  });

  it("applies the correct classes for size and color", () => {
    const { container } = render(
      <TextInput.Icon>
        <span>Icon</span>
      </TextInput.Icon>
    );

    expect(container.firstChild).toHaveClass("w-5 h-5 text-slate-500");
  });
});

describe("TextInput.Input", () => {
  it("renders the input with default props", () => {
    const { getByPlaceholderText } = render(
      <TextInput.Input placeholder="Enter text" />
    );

    expect(getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("allows typing and value change", () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText } = render(
      <TextInput.Input placeholder="Type here" onChange={handleChange} />
    );

    const input = getByPlaceholderText("Type here");
    fireEvent.change(input, { target: { value: "New text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disables the input when disabled prop is passed", () => {
    const { getByPlaceholderText } = render(
      <TextInput.Input placeholder="Disabled input" disabled />
    );

    const input = getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });
});

describe("TextInput.CurrencyInput", () => {
  it("renders the currency input with default value", () => {
    const mockOnChange = vi.fn();
    const { getByDisplayValue } = render(
      <TextInput.CurrencyInput
        defaultValue={1000}
        onChange={mockOnChange}
        currency="BRL"
      />
    );

    expect(getByDisplayValue("R$ 1.000,00")).toBeInTheDocument();
  });

  it("updates value when typed into", () => {
    const mockOnChange = vi.fn();
    const { getByDisplayValue } = render(
      <TextInput.CurrencyInput
        defaultValue={500}
        onChange={mockOnChange}
        currency="BRL"
      />
    );

    const input = getByDisplayValue("R$ 500,00");
    fireEvent.change(input, { target: { value: "600" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("disables the input when disabled prop is passed", () => {
    const mockOnChange = vi.fn();

    const { getByDisplayValue } = render(
      <TextInput.CurrencyInput
        defaultValue={1000}
        onChange={mockOnChange}
        disabled
        currency="BRL"
      />
    );

    const input = getByDisplayValue("R$ 1.000,00");
    expect(input).toBeDisabled();
  });
});
