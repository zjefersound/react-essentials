import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonProps {
  /**
   * What background color to use
   */
  variant?:
    | "primary"
    | "danger"
    | "success"
    | "secondary"
    | "tertiary";
  /**
   * Html button type
   */
  behavior?: "button" | "submit" | "reset";
  /**
   * Button contents
   */
  children: ReactNode;
  /**
   * Optional click handler
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Optional classes (TW won't appear on storybook)
   */
  className?: string;
  /**
   * Optional disabled behavior
   */
  disabled?: boolean;
}
/**
 * Primary UI component for user interaction
 */
export function Button({
  variant = "primary",
  children,
  onClick,
  className,
  behavior,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md flex items-center py-2.5 px-3.5 text-sm leading-5 font-semibold transition disabled:opacity-75 disabled:pointer-events-none space-x-2.5",
        className,
        {
          "bg-zinc-900 hover:bg-zinc-800 active:bg-slate-700 text-white":
            variant === "primary",
          "bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white":
            variant === "secondary",
          "bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-zinc-900":
            variant === "tertiary",
          "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white":
            variant === "success",
          "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white":
            variant === "danger",
        }
      )}
      type={behavior}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
