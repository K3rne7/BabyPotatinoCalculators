import React, { ReactNode, forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

// Haptic feedback function for a responsive feel on mobile
const triggerHapticFeedback = () => {
    if (navigator && 'vibrate' in navigator) {
        navigator.vibrate(10); // A short vibration for a tap
    }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className = '', onClick, ...props }, ref) => {
  const baseClasses =
    'flex items-center justify-center h-16 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-primary transition-all duration-150 text-base-content p-1 text-center leading-tight btn-glass no-selection-menu';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHapticFeedback();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button ref={ref} className={`${baseClasses} ${className}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
