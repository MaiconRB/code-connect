import type { FC, ButtonHTMLAttributes } from "react";

export interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc: string;
  iconAlt: string;
  label: string;
}

export const SocialButton: FC<SocialButtonProps> = ({
  iconSrc,
  iconAlt,
  label,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-brand-muted hover:text-white hover:bg-brand-hover-dark active:bg-brand-active-dark transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`.trim()}
      {...props}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <img
          src={iconSrc}
          alt={iconAlt}
          className="w-7 h-7 object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-normal">{label}</span>
    </button>
  );
};

