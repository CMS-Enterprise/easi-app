/**
 * Error Meta Store
 *
 * A in-memory store that maintains the current error metadata state across
 * the application. This store allows components to set and retrieve error message
 * overrides without needing to pass props through multiple component layers. The
 * store is typically used by the ErrorMessageProvider to manage global error state
 * and provide error handling patterns throughout the application.
 */
import React from 'react';

let currentMeta: {
  overrideMessage?: string | React.ReactNode;
  skipError?: boolean;
} = {};

export const setCurrentErrorMeta = (meta: typeof currentMeta) => {
  currentMeta = meta;
};

export const getCurrentErrorMeta = () => currentMeta;
