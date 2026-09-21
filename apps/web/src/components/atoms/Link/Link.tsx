import type { FC, ReactNode, AnchorHTMLAttributes } from "react";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "muted" | "highlight";
  icon?: ReactNode;
}

export const Link: FC<LinkProps> = ({
  children,
  variant = "default",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles = "transition-colors cursor-pointer select-none inline-flex items-center gap-1";

  const variantStyles = {
    default: "text-brand-green hover:text-brand-green-hover hover:underline",
    muted: "text-xs text-brand-muted hover:text-white hover:underline",
    highlight: "text-sm text-brand-green hover:text-brand-green-hover font-medium hover:underline",
  }[variant];

  return (
    <a className={`${baseStyles} ${variantStyles} ${className}`.trim()} {...props}>
      <span>{children}</span>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </a>
  );
};

