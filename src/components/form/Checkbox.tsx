import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { PiCheckBold } from "react-icons/pi";
import { SemanticColor } from "../../models/semanticColor";

export interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {
  color?: SemanticColor;
}

export function Checkbox({
  checked,
  onChange,
  className,
  color = "primary",
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      className={clsx(
        "size-6 rounded shrink-0 ring-1 ring-slate-300",
        className
      )}
      onClick={onChange}
      {...props}
    >
      <CheckboxPrimitive.CheckboxIndicator asChild>
        <PiCheckBold
          className={clsx("size-6 rounded p-[3px]", {
            "bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white":
              color === "primary",
            "bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white":
              color === "secondary",
            "bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900":
              color === "tertiary",
            "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white":
              color === "success",
            "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white":
              color === "danger",
          })}
        />
      </CheckboxPrimitive.CheckboxIndicator>
    </CheckboxPrimitive.Root>
  );
}
