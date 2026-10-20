import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'blue' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-[#1e1e1e] text-gray-300 border-[#2e2e2e]',
    blue: 'bg-blue-950/60 text-blue-300 border-blue-800',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
