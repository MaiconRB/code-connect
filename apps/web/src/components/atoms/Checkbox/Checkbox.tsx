import type { FC, ReactNode, InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const Checkbox: FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 text-xs text-brand-muted select-none cursor-pointer transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:text-white"
      } ${className}`.trim()}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          data-testid="checkbox-custom-box"
          className="w-4 h-4 rounded border border-brand-green bg-transparent flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-brand-green peer-focus:ring-offset-1 peer-focus:ring-offset-brand-dark peer-checked:bg-brand-green peer-checked:text-brand-dark-text"
        >
          {checked && (
            <Check
              size={12}
              strokeWidth={3.5}
              className="text-brand-dark-text"
              data-testid="checkbox-check-icon"
            />
          )}
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

