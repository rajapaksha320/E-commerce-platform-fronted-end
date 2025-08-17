import React from "react";
import {
  X,
  AlertTriangle,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import { Button } from "../../components/ui/ContactUis/Uis";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'danger', 'info', 'success'
  isLoading = false,
  icon,
  children,
}) => {
  if (!isOpen) return null;

  // Icon configuration based on type
  const getIconConfig = () => {
    if (icon) {
      return { Icon: icon.component, className: icon.className };
    }

    switch (type) {
      case "danger":
        return {
          Icon: AlertTriangle,
          className: "h-6 w-6 text-red-600",
          bgClassName: "bg-red-100",
        };
      case "warning":
        return {
          Icon: AlertCircle,
          className: "h-6 w-6 text-amber-600",
          bgClassName: "bg-amber-100",
        };
      case "info":
        return {
          Icon: Info,
          className: "h-6 w-6 text-blue-600",
          bgClassName: "bg-blue-100",
        };
      case "success":
        return {
          Icon: CheckCircle,
          className: "h-6 w-6 text-green-600",
          bgClassName: "bg-green-100",
        };
      default:
        return {
          Icon: HelpCircle,
          className: "h-6 w-6 text-gray-600",
          bgClassName: "bg-gray-100",
        };
    }
  };

  // Button variant based on type
  const getConfirmButtonVariant = () => {
    switch (type) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      case "success":
        return "primary";
      case "info":
        return "primary";
      default:
        return "primary";
    }
  };

  const { Icon, className: iconClassName, bgClassName } = getIconConfig();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${bgClassName}`}
            >
              <Icon className={iconClassName} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
          {children}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Specialized confirmation dialogs for common use cases
export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName,
  itemType = "item",
  isLoading = false,
  additionalWarning,
}) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      type="danger"
      confirmText={
        <div className="flex items-center">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </div>
      }
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          {itemName ? (
            <span className="font-medium text-gray-900">"{itemName}"</span>
          ) : (
            `this ${itemType}`
          )}
          ? This action cannot be undone.
        </p>
        {additionalWarning && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{additionalWarning}</p>
          </div>
        )}
      </div>
    </ConfirmationDialog>
  );
};

export const AccountDeletionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  userEmail,
}) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Account"
      type="danger"
      confirmText={
        <div className="flex items-center">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete My Account
        </div>
      }
      cancelText="Keep My Account"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to permanently delete your account? This action
          is <strong>irreversible</strong> and will result in:
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="text-sm text-red-800 space-y-2">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Permanent deletion of all your personal data</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Loss of all order history and tracking information</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Removal of all saved addresses and preferences</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Deletion of wishlist and cart items</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Cancellation of any active subscriptions</span>
            </li>
          </ul>
        </div>

        {userEmail && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Account to be deleted:{" "}
              <span className="font-medium text-gray-900">{userEmail}</span>
            </p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> If you have any pending orders or unresolved
            issues, please contact customer support before proceeding.
          </p>
        </div>
      </div>
    </ConfirmationDialog>
  );
};

export const AddressDeletionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  address,
}) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Address"
      type="danger"
      confirmText={
        <div className="flex items-center">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Address
        </div>
      }
      cancelText="Keep Address"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>

        {address && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-gray-600">{address.streetAddress}</p>
              {address.apartment && (
                <p className="text-gray-600">{address.apartment}</p>
              )}
              <p className="text-gray-600">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-gray-600">{address.phoneNumber}</p>
            </div>
            {address.isDefault && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Default Address
                </span>
              </div>
            )}
          </div>
        )}

        {address?.isDefault && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> This is your default address. After
              deletion, you'll need to set another address as default for
              seamless checkout.
            </p>
          </div>
        )}
      </div>
    </ConfirmationDialog>
  );
};

export default ConfirmationDialog;
