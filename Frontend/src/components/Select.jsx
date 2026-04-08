import { cn } from '../utils/cn';
import Label from './Label';

const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={id} className="mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        data-slot="select"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-border bg-input-background/70 text-foreground px-3 py-2 text-base backdrop-blur transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:[&>option]:bg-background dark:[&>option]:text-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:shadow-[var(--glow-primary)]",
          error ? "border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40" : "",
          className,
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default Select;
