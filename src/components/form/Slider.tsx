import * as SliderPrimitive from "@radix-ui/react-slider";
import clsx from "clsx";

interface SliderProps
  extends Omit<
    SliderPrimitive.SliderProps,
    "className" | "children" | "onValueChange" | "onChange"
  > {
  height?: string;
  width?: string;
  required?: boolean;
  onChange?: (value: number[]) => void;
}

export function Slider({
  height,
  width,
  required,
  onChange,
  orientation = "horizontal",
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      {...props}
      onValueChange={onChange}
      className={clsx("relative flex items-center select-none touch-none", {
        "flex-col w-5": orientation === "vertical",
        "h-5": orientation === "horizontal",
        [`h-[${height}]`]: height,
        "h-80": !height && orientation === "vertical",
        "w-min": !width && orientation === "vertical",
        [`w-[${width}]`]: width,
        "w-80": !width && orientation === "horizontal",
        "opacity-50 [&>*>*]:cursor-not-allowed": props.disabled,
      })}
      aria-required={required}
      orientation={orientation}
    >
      <SliderPrimitive.Track
        className={clsx("bg-slate-300 relative grow rounded-full", {
          "w-[3px]": orientation === "vertical",
          "h-[3px]": orientation === "horizontal",
        })}
      >
        <SliderPrimitive.Range
          className={clsx("absolute bg-slate-900 rounded-full", {
            "w-full": orientation === "vertical",
            "h-full": orientation === "horizontal",
          })}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-5 rounded-full bg-slate-900 hover:bg-slate-800" />
      <SliderPrimitive.Thumb className="block size-5 rounded-full bg-slate-900 hover:bg-slate-800" />
    </SliderPrimitive.Root>
  );
}
