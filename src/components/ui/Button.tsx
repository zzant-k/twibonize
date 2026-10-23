import React from 'react';
import { Loader2 } from 'lucide-react';
import { playPillClick } from '../../lib/pillInteractions';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'emerald';
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
  onPointerDown,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const sizeClasses = {
    sm: 'min-h-[36px] px-3.5 text-xs font-medium gap-1.5',
    md: 'min-h-[44px] px-5 py-2 text-xs sm:text-sm font-medium gap-2',
    lg: 'min-h-[48px] px-6 py-2.5 text-sm sm:text-base font-semibold gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'btn-pill-primary font-semibold',
    secondary: 'btn-pill-secondary',
    ghost: 'btn-pill-ghost',
    danger: 'btn-pill-danger font-semibold',
    emerald: 'btn-pill-emerald font-semibold',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      playPillClick();
    }
    onPointerDown?.(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty('--mouse-x', '50%');
    e.currentTarget.style.setProperty('--mouse-y', '50%');
    onMouseLeave?.(e);
  };

  return (
    <button
      className={`btn-pill ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onPointerDown={handlePointerDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Lapisan kilau lensa lengkungan atas (design_button.md) */}
      <span className="pill-specular" aria-hidden="true" />

      {/* Label & Icon Container */}
      <span className="btn-label">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
};


