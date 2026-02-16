import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

const alertVariants = {
  variant: {
    default: "bg-card text-card-foreground",
    destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  },
};

const Alert = ({ type = 'info', variant, message, onClose, className = '', children, ...props }) => {
  const types = {
    success: {
      icon: CheckCircle,
      variant: 'success',
    },
    error: {
      icon: XCircle,
      variant: 'error',
    },
    warning: {
      icon: AlertCircle,
      variant: 'warning',
    },
    info: {
      icon: Info,
      variant: 'info',
    },
  };

  const alertType = types[type] || types.info;
  const Icon = alertType.icon;
  const alertVariant = variant || alertType.variant;
  const variantClass = alertVariants.variant[alertVariant] || alertVariants.variant.default;

  return (
    <div 
      data-slot="alert"
      role="alert"
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3",
        variantClass,
        className
      )}
      {...props}
    >
      <Icon className="flex-shrink-0 size-4 translate-y-0.5" />
      <div className="flex-1">
        {message && <p className="text-sm">{message}</p>}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:opacity-75 focus:outline-none flex-shrink-0"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

const AlertTitle = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
};

const AlertDescription = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
};

export default Alert;
export { Alert, AlertTitle, AlertDescription };
