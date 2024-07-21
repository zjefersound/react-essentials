import { TextareaHTMLAttributes } from "react";
import { InputRoot } from "./atoms/InputRoot";
import { clsx } from "clsx";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea(props: TextareaProps) {
  return (
    <InputRoot>
      <textarea
        className={clsx(
          "outline-0 bg-transparent flex-1 text-slate-900 text-sm placeholder:text-slate-500",
          props.className
        )}
        {...props}
      ></textarea>
    </InputRoot>
  );
}
