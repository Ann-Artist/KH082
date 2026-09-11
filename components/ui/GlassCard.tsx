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
        glow ? 'border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : ''
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-50 blur-2xl" />
      )}
      <div className="relative z-10 p-5 md:p-6">{children}</div>
    </div>
  );
};
