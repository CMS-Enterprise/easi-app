import React from 'react';
import {
  FieldPath,
  FieldValues,
  RefCallBack,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn
} from 'react-hook-form';

export type EasiPartialSubmitProps<TFieldValues extends FieldValues> = {
  update: (
    /** Object containing valid dirty field values */
    formData: Partial<TFieldValues>
  ) => Promise<any>;
  /** Callback to execute after updating */
  callback?: () => void;
  /** Whether to clear field error messages */
  clearErrors?: boolean;
};

export type EasiPartialSubmit<TFieldValues extends FieldValues> = ({
  update,
  clearErrors,
  callback
}: EasiPartialSubmitProps<TFieldValues>) => Promise<void>;

export type EasiFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: RegisterOptions<TFieldValues, TFieldName>
) => UseFormRegisterReturn<TFieldName> & { inputRef: RefCallBack };

export type UseEasiFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = Omit<UseFormReturn<TFieldValues, TContext>, 'register'> & {
  /** Ignore errors and submit valid dirty field values */
  partialSubmit: EasiPartialSubmit<TFieldValues>;
  /** Custom register function that returns `inputRef` for function components */
  register: EasiFormRegister<TFieldValues>;
};

export type EasiFormProviderProps<
  TFieldValues extends FieldValues,
  TContext = any
> = {
  children: React.ReactNode | React.ReactNode[];
} & UseEasiFormReturn<TFieldValues, TContext>;
