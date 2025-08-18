/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";

const ToastNotification = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([]);
  const maxNotifications = 3; // Maximum number of toasts to show at once

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    showNotification: (
      message,
      type = "success",
      action = null,
      duration = 4000
    ) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type,
        action,
        duration,
        timestamp: Date.now(),
      };

      setNotifications((prev) => {
        let newNotifications = [...prev];

        // Remove oldest notifications if we exceed the limit
        if (newNotifications.length >= maxNotifications) {
          const excessCount = newNotifications.length - maxNotifications + 1;
          newNotifications = newNotifications.slice(excessCount);
        }

        // Add new notification
        return [...newNotifications, notification];
      });

      // Auto-dismiss after specified duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);

      return id; // Return ID for manual removal if needed
    },

    removeNotification: (id) => {
      removeNotification(id);
    },

    clearAll: () => {
      setNotifications([]);
    },
  }));

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Get icon for notification type
  const getIcon = (type) => {
    const iconProps = "h-4 w-4 sm:h-5 sm:w-5";

    switch (type) {
      case "success":
        return <CheckCircle className={`${iconProps} text-green-600`} />;
      case "error":
        return <AlertCircle className={`${iconProps} text-red-600`} />;
      case "warning":
        return <AlertTriangle className={`${iconProps} text-yellow-600`} />;
      case "info":
        return <Info className={`${iconProps} text-blue-600`} />;
      case "cart":
        return <ShoppingCart className={`${iconProps} text-blue-600`} />;
      default:
        return <Info className={`${iconProps} text-blue-600`} />;
    }
  };

  // Get styles for notification type
  const getNotificationStyles = (type) => {
    const baseStyles = "bg-white backdrop-blur-sm";

    switch (type) {
      case "success":
        return `${baseStyles} border-green-200`;
      case "error":
        return `${baseStyles} border-red-200`;
      case "warning":
        return `${baseStyles} border-yellow-200`;
      case "info":
      case "cart":
        return `${baseStyles} border-blue-200`;
      default:
        return `${baseStyles} border-blue-200`;
    }
  };

  // Get icon background styles
  const getIconBackgroundStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      case "info":
      case "cart":
        return "bg-blue-100";
      default:
        return "bg-blue-100";
    }
  };

  // Get progress bar styles
  const getProgressBarStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
      case "cart":
        return "bg-blue-500";
      default:
        return "bg-blue-500";
    }
  };

  // Get action button styles
  const getActionButtonStyles = (type) => {
    switch (type) {
      case "success":
        return "text-green-700 hover:text-green-800 active:text-green-900";
      case "error":
        return "text-red-700 hover:text-red-800 active:text-red-900";
      case "warning":
        return "text-yellow-700 hover:text-yellow-800 active:text-yellow-900";
      case "info":
      case "cart":
        return "text-blue-700 hover:text-blue-800 active:text-blue-900";
      default:
        return "text-blue-700 hover:text-blue-800 active:text-blue-900";
    }
  };

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 space-y-2 sm:w-full sm:max-w-md pointer-events-none">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`
              relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border
              transform transition-all duration-500 ease-out
              translate-y-0 opacity-100 scale-100 pointer-events-auto
              ${getNotificationStyles(notification.type)}
            `}
            style={{
              animation: "slideDown 0.5s ease-out",
              zIndex: 1000 - index, // Ensure newer toasts appear on top
            }}
          >
            {/* Progress bar */}
            <div
              className={`absolute top-0 left-0 h-0.5 sm:h-1 ${getProgressBarStyles(
                notification.type
              )}`}
              style={{
                width: "100%",
                animation: `progress ${notification.duration}ms linear`,
              }}
            />

            <div className="p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 p-1 sm:p-1.5 rounded-full ${getIconBackgroundStyles(
                    notification.type
                  )}`}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Action button */}
                  {notification.action && (
                    <button
                      onClick={() => {
                        notification.action.action();
                        removeNotification(notification.id);
                      }}
                      className={`mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold underline-offset-2 hover:underline active:scale-95 transition-all duration-200 ${getActionButtonStyles(
                        notification.type
                      )}`}
                    >
                      {notification.action.text}
                    </button>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 p-1.5 sm:p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-200 touch-manipulation"
                  aria-label="Close notification"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles - Using regular style tag instead of styled-jsx */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
            scale: 0.95;
          }
          to {
            transform: translateY(0);
            opacity: 1;
            scale: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
              scale: 0.98;
            }
            to {
              transform: translateY(0);
              opacity: 1;
              scale: 1;
            }
          }
        }

        /* Ensure proper line clamping */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Touch-friendly interactions */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
});

ToastNotification.displayName = "ToastNotification";

export default ToastNotification;

// Hook for easier usage
export const useToast = () => {
  const toastRef = React.useRef(null);

  const showToast = {
    success: (message, action, duration) =>
      toastRef.current?.showNotification(message, "success", action, duration),

    error: (message, action, duration) =>
      toastRef.current?.showNotification(message, "error", action, duration),

    info: (message, action, duration) =>
      toastRef.current?.showNotification(message, "info", action, duration),

    warning: (message, action, duration) =>
      toastRef.current?.showNotification(message, "warning", action, duration),

    cart: (message, action, duration) =>
      toastRef.current?.showNotification(message, "cart", action, duration),

    custom: (message, type, action, duration) =>
      toastRef.current?.showNotification(message, type, action, duration),

    clear: () => toastRef.current?.clearAll(),

    remove: (id) => toastRef.current?.removeNotification(id),
  };

  return { toastRef, showToast };
};
