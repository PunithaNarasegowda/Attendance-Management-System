import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/70"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div
          className={`relative z-50 inline-block w-full rounded-2xl text-left overflow-hidden shadow-xl transform transition-all ${sizeClasses[size]} glass-card bg-[color:var(--modal)] text-card-foreground border border-[color:var(--glass-border)] max-h-[85vh]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[color:var(--border)]">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground focus:outline-none rounded-md focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
