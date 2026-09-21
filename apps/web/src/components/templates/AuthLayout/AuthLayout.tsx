import type { FC, ReactNode } from "react";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  banner: ReactNode;
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  title,
  subtitle,
  banner,
  children,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-brand-black flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Decorative Chain Logos (Code Connect Watermark) */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 w-96 h-96 opacity-10 text-brand-green select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="12" className="w-full h-full">
          <rect x="30" y="30" width="80" height="110" rx="40" />
          <rect x="75" y="70" width="80" height="110" rx="40" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute -bottom-16 -right-12 w-[480px] h-[480px] opacity-10 text-brand-green select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="12" className="w-full h-full">
          <rect x="30" y="30" width="80" height="110" rx="40" />
          <rect x="75" y="70" width="80" height="110" rx="40" />
        </svg>
      </div>

      {/* Main Authentication Card */}
      <main className="relative z-10 w-full max-w-4xl bg-brand-dark rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-brand-border-card/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Custom Banner */}
          <div className="w-full h-full flex items-center justify-center">
            {banner}
          </div>

          {/* Right Column: Title, Subtitle and Form */}
          <div className="flex flex-col justify-center w-full">
            <header className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-brand-muted mt-1.5">
                {subtitle}
              </p>
            </header>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

