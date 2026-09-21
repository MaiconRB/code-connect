import type { FC } from "react";

export interface AuthBannerProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export const AuthBanner: FC<AuthBannerProps> = ({
  imageSrc,
  imageAlt,
  className = "",
}) => {
  return (
    <div className={`relative w-full h-full min-h-[380px] md:min-h-[540px] rounded-2xl overflow-hidden shadow-inner ${className}`.trim()}>
      <img
        src={imageSrc}
        alt={imageAlt}
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
};

