import type { FC } from "react";

export interface AvatarProps {
  /** URL da imagem do usuário */
  src?: string;
  /** Texto alternativo para acessibilidade */
  alt: string;
  /** Tamanho do avatar */
  size?: "sm" | "md" | "lg";
  /** Fallback: iniciais do usuário quando não houver imagem */
  initials?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  initials,
}) => {
  const classes = `inline-flex items-center justify-center rounded-full overflow-hidden bg-brand-input text-brand-muted font-semibold shrink-0 ${sizeStyles[size]}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${classes} object-cover`}
      />
    );
  }

  return (
    <span className={classes} aria-label={alt} role="img">
      {initials ? initials.slice(0, 2).toUpperCase() : "?"}
    </span>
  );
};
