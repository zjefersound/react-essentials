import { InputHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { CurrencyInput as TextCurrencyInput } from "./CurrencyInput";

export interface TextInputInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export interface TextInputRootProps {
  children: ReactNode;
  variant?: "danger" | "success";
}

function TextInputRoot({ children, variant }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        `
        h-10
        flex items-center space-x-2
        py-2 px-3 rounded-md
        border
        bg-white
        w-full 
        focus-within:ring-2 ring-slate-500
      `,
        {
          "border-slate-300": !variant,
          "border-red-600": variant === "danger",
          "border-emerald-600": variant === "success",
        }
      )}
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
  return <Slot className="w-5 h-5 text-slate-500">{children}</Slot>;
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

Object.assign(TextCurrencyInput, { displayName: "TextInput.CurrencyInput" });

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
  CurrencyInput: TextCurrencyInput,
};
