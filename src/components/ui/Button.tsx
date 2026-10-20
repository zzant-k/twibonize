import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
    md: 'h-11 px-5 text-sm rounded-xl gap-2 min-h-[44px]',
    lg: 'h-12 px-6 text-sm font-semibold rounded-xl gap-2.5 min-h-[48px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md font-semibold transition-colors',
    secondary:
      'bg-[#222222] hover:bg-[#2c2c2c] active:bg-[#1a1a1a] text-gray-200 hover:text-white border border-[#333333] transition-colors',
    ghost:
      'bg-transparent hover:bg-[#222222] text-gray-300 hover:text-white transition-colors',
    danger:
      'bg-red-950/40 hover:bg-red-900/60 active:bg-red-900 text-red-300 border border-red-900/60 transition-colors',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
