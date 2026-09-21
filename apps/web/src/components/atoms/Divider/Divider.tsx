import type { FC } from "react";

export interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: FC<DividerProps> = ({ text, className = "" }) => {
  if (!text) {
    return <hr className={`w-full border-t border-brand-border my-4 ${className}`.trim()} />;
  }

  return (
    <div className={`relative flex items-center justify-center w-full my-3 ${className}`.trim()}>
      <div className="flex-grow border-t border-brand-border" />
      <span className="flex-shrink mx-3 text-xs text-brand-muted select-none">
        {text}
      </span>
      <div className="flex-grow border-t border-brand-border" />
    </div>
  );
};

