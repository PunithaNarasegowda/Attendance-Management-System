import { cn } from '../utils/cn';

const buttonVariants = {
  variant: {
    default:
      "bg-primary text-primary-foreground shadow-sm hover:shadow-[var(--glow-primary)] active:scale-95",
    destructive:
      "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 active:scale-95",
    outline:
      "border border-border bg-card/40 text-foreground backdrop-blur hover:bg-card/55 hover:shadow-[var(--glow-primary)] active:scale-95",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[var(--glow-primary)] active:scale-95",
    ghost:
      "hover:bg-accent hover:text-accent-foreground hover:shadow-[var(--glow-primary)] active:scale-95",
    link: "text-primary underline-offset-4 hover:underline active:opacity-75",
  },
  size: {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-9 rounded-md",
  },
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  asChild = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:shadow-[var(--glow-primary)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
  
  const variantClass = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-slot="button"
      className={cn(baseClasses, variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
