import React, { forwardRef } from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}, ref) => {
  const baseClasses = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const loadingClass = loading ? 'button--loading' : '';
  const fullWidthClass = fullWidth ? 'button--full-width' : '';
  
  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    loadingClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="button__spinner" aria-hidden="true">
          <svg className="button__spinner-icon" viewBox="0 0 24 24">
            <circle
              className="button__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="button__icon button__icon--left" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className="button__text">
        {loading ? 'Loading...' : children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="button__icon button__icon--right" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;