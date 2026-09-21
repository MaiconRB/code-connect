import { forwardRef } from "react";
import { Input, type InputProps } from "../../atoms/Input/Input";

export interface FormFieldProps extends InputProps {
  label: string;
  id: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, className = "", ...inputProps }, ref) => {
    return (
      <div className={`flex flex-col w-full text-left ${className}`.trim()}>
        <label htmlFor={id} className="block text-xs font-normal text-brand-muted mb-1.5">
          {label}
        </label>
        <Input
          id={id}
          ref={ref}
          hasError={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {error && (
          <span id={`${id}-error`} className="mt-1 text-xs text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

