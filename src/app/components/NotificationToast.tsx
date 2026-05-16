import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Zap } from 'lucide-react';
import { EventType } from '../types/index';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'event';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  eventType?: EventType;
  duration?: number;
}

interface NotificationToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    if (toast.type === 'event') {
      switch (toast.eventType) {
        case 'wicket':
          return <Zap className="w-5 h-5" />;
        case 'bail_dislodged':
          return <AlertCircle className="w-5 h-5" />;
        default:
          return <Info className="w-5 h-5" />;
      }
    }

    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    if (toast.type === 'event') {
      switch (toast.eventType) {
        case 'wicket':
          return 'bg-red-900 border-red-500 text-red-100';
        case 'bail_dislodged':
          return 'bg-orange-900 border-orange-500 text-orange-100';
        case 'stump_motion':
          return 'bg-yellow-900 border-yellow-500 text-yellow-100';
        default:
          return 'bg-blue-900 border-blue-500 text-blue-100';
      }
    }

    switch (toast.type) {
      case 'success':
        return 'bg-green-900 border-green-500 text-green-100';
      case 'error':
        return 'bg-red-900 border-red-500 text-red-100';
      case 'warning':
        return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      default:
        return 'bg-blue-900 border-blue-500 text-blue-100';
    }
  };

  return (
    <div
      className={`${getStyles()} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string, eventType?: EventType, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, type, message, eventType, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    addToast,
    dismissToast,
    showSuccess: (message: string) => addToast('success', message),
    showError: (message: string) => addToast('error', message),
    showWarning: (message: string) => addToast('warning', message),
    showInfo: (message: string) => addToast('info', message),
    showEvent: (message: string, eventType: EventType) => addToast('event', message, eventType, 4000)
  };
}
