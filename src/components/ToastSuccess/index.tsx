import React from 'react';
import { toast } from 'react-toastify';

import Alert from 'components/Alert';

import './index.scss';

/**
 * Utility function to show a success toast with an Alert component
 * @param message - The success message to display
 * @param options - Optional toast configuration options
 */
const toastSuccess = (
  message: string | React.ReactNode,
  options?: {
    autoClose?: number | false;
    position?:
      | 'top-right'
      | 'top-center'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-center'
      | 'bottom-left';
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    id?: string;
    heading?: string;
  }
) => {
  // Use shorter timeout in Cypress tests to prevent toasts from covering elements
  const autoCloseTime = (window as any).Cypress ? 100 : 3000;

  const defaultOptions = {
    autoClose: autoCloseTime,
    position: 'top-center' as const,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    id: 'toast-success',
    ...options,
    className:
      options?.position === 'top-right'
        ? 'custom-toast-width'
        : 'custom-toast-width-center'
  };

  return toast.success(
    <Alert
      type="success"
      isClosable={false}
      slim={false}
      data-testid="alert"
      heading={options?.heading}
    >
      {message}
    </Alert>,
    defaultOptions
  );
};

export default toastSuccess;
