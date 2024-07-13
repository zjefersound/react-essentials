import { InputHTMLAttributes, ReactNode, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { toCurrency } from "../../utils/toCurrency";

export interface TextInputInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export interface TextInputRootProps {
  children: ReactNode;
}

function TextInputRoot({ children }: TextInputRootProps) {
  return (
    <div
      className={`
        h-10
        flex items-center space-x-2
        py-4 px-3 rounded-md
        border
        border-slate-300
        bg-white
        w-full 
        focus-within:ring-2 ring-slate-500
      `}
    >
      {children}
    </div>
  );
}
TextInputRoot.displayName = "TextInput.Root";

export interface TextInputIconProps {
  children: ReactNode;
}

function TextInputIcon({ children }: TextInputIconProps) {
  return <Slot className="w-6 h-6 text-slate-500">{children}</Slot>;
}
TextInputIcon.displayName = "TextInput.Icon";

function TextInputInput(props: TextInputInputProps) {
  return (
    <input
      className="outline-0 bg-transparent flex-1 text-zinc-900 text-sm placeholder:text-slate-500"
      {...props}
    />
  );
}
TextInputInput.displayName = "TextInput.Input";

interface TextInputCurrencyProps {
  defaultValue: number;
  onChange: (value: number) => void;
  currency?: string;
  locale?: string;
}
function TextInputCurrency({
  defaultValue,
  onChange,
  locale,
  currency,
}: TextInputCurrencyProps) {
  const [displayValue, setDisplayValue] = useState(
    defaultValue?.toFixed(2).replace(/\D/g, "") || ""
  );
  const numericValue = Number(displayValue) / 100;

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const numbers = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (numbers.trim()) setDisplayValue(numbers);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      const hasSelection =
        e.currentTarget.selectionStart !== e.currentTarget.selectionEnd;
      if (hasSelection) {
        setDisplayValue("");
        return;
      }
    }
    if (e.key === "Backspace") {
      const value = displayValue
        .split("")
        .filter((_, i) => i < displayValue.length - 1)
        .join("");
      setDisplayValue(value);
    }
    if ("0123456789".includes(e.key)) {
      setDisplayValue(displayValue + e.key);
    }
  };

  return (
    <input
      className="outline-0 bg-transparent flex-1 text-zinc-900 text-sm placeholder:text-slate-500"
      inputMode="numeric"
      type="text"
      onChange={() => onChange(numericValue)}
      value={toCurrency(numericValue, { locale, currency })}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
    />
  );
}
TextInputCurrency.displayName = "TextInput.CurrencyInput";

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
  CurrencyInput: TextInputCurrency,
};
