import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-[#e2e8e3] bg-white text-gray-900 shadow-sm transition-all duration-300 hover:shadow-md ${
        glow ? 'border-[#10b981]/40 shadow-md' : ''
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#10b981]/10 blur-3xl" />
      )}
      <div className="relative z-10 p-5 md:p-6">{children}</div>
    </div>
  );
};
