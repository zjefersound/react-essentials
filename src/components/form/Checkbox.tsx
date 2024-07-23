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
        "size-7 rounded border-[1px] bg-slate-100 shrink-0",
        className
      )}
      onClick={onChange}
      {...props}
    >
      <CheckboxPrimitive.CheckboxIndicator asChild>
        <PiCheckBold
          className={clsx(
            "size-7 rounded border-[1px] p-[3px] -ml-[1px] -mt-[1px]",
            {
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
            }
          )}
        />
      </CheckboxPrimitive.CheckboxIndicator>
    </CheckboxPrimitive.Root>
  );
}
