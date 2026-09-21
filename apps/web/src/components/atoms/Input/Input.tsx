import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", disabled, ...props }, ref) => {
    const baseStyles =
      "w-full bg-brand-input text-white placeholder-brand-placeholder px-3.5 py-2.5 rounded-lg border outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed";

    const stateStyles = hasError
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-transparent focus:border-brand-green focus:ring-1 focus:ring-brand-green";

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${stateStyles} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

