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
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue/50 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs rounded-lg gap-1.5',
    md: 'h-11 px-5 text-sm rounded-apple gap-2 min-h-[44px]',
    lg: 'h-12 px-6 text-base rounded-apple gap-2.5 min-h-[48px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-apple-blue text-white hover:bg-apple-blueHover active:bg-apple-blueActive shadow-sm',
    secondary:
      'bg-apple-surface hover:bg-apple-surfaceHover text-apple-text border border-apple-border/50 hover:border-apple-border active:bg-apple-surfaceHover',
    ghost:
      'bg-transparent hover:bg-apple-surface text-apple-text active:bg-apple-surfaceHover',
    danger:
      'bg-red-50 hover:bg-red-100 text-apple-danger border border-red-200 active:bg-red-200/80',
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
