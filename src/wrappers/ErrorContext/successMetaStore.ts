/**
 * Success Meta Store
 *
 * A in-memory store that maintains the current success metadata state across
 * the application. This store allows components to set and retrieve success message
 * overrides without needing to pass props through multiple component layers. The
 * store is typically used by the SuccessMessageProvider to manage global success state
 * and provide success handling patterns throughout the application.
 */
import React from 'react';

let currentMeta: {
  overrideMessage?: string | React.ReactNode;
  skipSuccess?: boolean;
} = {};

export const setCurrentSuccessMeta = (meta: typeof currentMeta) => {
  currentMeta = meta;
};

export const getCurrentSuccessMeta = () => currentMeta;
