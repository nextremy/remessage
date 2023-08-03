import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const button = cva("button", {
  variants: {
    intent: {
      primary: "bg-blue-700 font-bold text-gray-100 hover:bg-blue-600",
      secondary:
        "border border-gray-300 font-semibold text-gray-600 hover:bg-gray-200 hover:text-gray-900",
    },
    size: {
      sm: "h-12 px-4",
      md: "h-14 px-6",
      lg: "h-16 px-8 text-lg",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, ...props }: ButtonProps) {
  const buttonClassName = button({ intent: props.intent, size: props.size });
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-md duration-150 ${className} ${buttonClassName}`}
      {...props}
    />
  );
}
