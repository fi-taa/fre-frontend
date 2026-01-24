interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'w-full min-h-[44px] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles =
    variant === 'primary'
      ? 'bg-accent text-card hover:opacity-90'
      : 'border border-border text-text-primary hover:bg-bg-light';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
