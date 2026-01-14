import { InputHTMLAttributes, forwardRef, ChangeEvent } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      disabled = false,
      size = 'md',
      color = 'primary',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-9 h-5',
      md: 'w-11 h-6',
      lg: 'w-14 h-8',
    };

    const handleSize = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const translateX = {
      sm: 'translate-x-3',
      md: 'translate-x-4',
      lg: 'translate-x-6',
    };



    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked, e)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div
          className={`
            ${sizeClasses[size]}
            relative
            rounded-full
            transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            peer
            ${checked ? 'bg-toggle-checked' : 'bg-[#BABABA]'}
          `}
        >
          <div
            className={`
              ${handleSize[size]}
              absolute
              top-1/2
              left-1
              -translate-y-1/2
              rounded-full
              bg-white
              shadow-md
              transition-transform
              ${checked ? translateX[size] : 'translate-x-0'}
            `}
          />
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;