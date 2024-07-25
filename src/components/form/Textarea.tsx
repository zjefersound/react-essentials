import { TextareaHTMLAttributes } from "react";
import { InputRoot } from "./atoms/InputRoot";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <InputRoot className={className}>
      <textarea
        className="outline-0 bg-transparent flex-1 text-slate-900 text-sm placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      ></textarea>
    </InputRoot>
  );
}
