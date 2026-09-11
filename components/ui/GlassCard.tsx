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
      className={`relative overflow-hidden rounded-2xl border border-[#6bfb9a]/10 bg-[#121b16]/70 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-[#6bfb9a]/30 ${
        glow ? 'shadow-[0_0_25px_rgba(107,251,154,0.1)] hover:shadow-[0_0_35px_rgba(107,251,154,0.2)]' : ''
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6bfb9a]/10 blur-3xl" />
      )}
      <div className="relative z-10 p-5 md:p-6">{children}</div>
    </div>
  );
};
