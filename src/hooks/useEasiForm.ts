import React, { useCallback } from 'react';
import {
  FieldValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';

export type UseEasiFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid: SubmitHandler<TFieldValues>,
  onInvalid?: SubmitErrorHandler<TFieldValues>,
  options?: {
    fields: Path<TFieldValues>[];
  }
) => (e?: React.BaseSyntheticEvent) => Promise<void>;

type PartialSubmit<TFieldValues extends FieldValues> = (
  update: (
    /** Object containing valid dirty field values */
    formData: Partial<TFieldValues>
  ) => Promise<any>,
  options?: {
    /** Whether to clear field error messages */
    clearErrors?: boolean;
    /** Callback to execute after updating */
    callback?: () => void;
  }
) => Promise<void>;

/**
 * Extension of React Hook Form's `useForm` hook
 */
function useEasiForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext> & {
  /** Ignore errors and submit valid dirty field values */
  partialSubmit: PartialSubmit<TFieldValues>;
} {
  const form = useForm<TFieldValues, TContext>(props);

  const {
    getValues,
    clearErrors,
    formState: { errors, dirtyFields, isDirty }
  } = form;

  /** Ignore errors and submit valid dirty field values */
  const partialSubmit: PartialSubmit<TFieldValues> = useCallback(
    async (update, options) => {
      // Clear field errors
      if (options?.clearErrors) clearErrors();

      if (isDirty) {
        const dirtyFieldKeys = Object.keys(dirtyFields)
          // Filter out fields with errors
          .filter(key => !errors[key]);

        const values = getValues();

        /** Object containing valid dirty field values */
        const data: Partial<TFieldValues> = dirtyFieldKeys.reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: values[key]
            };
          },
          {}
        );

        // Update values
        return (
          update(data)
            .then(() => options?.callback?.())
            // Ignore errors and execute callback
            .catch(() => options?.callback?.())
        );
      }

      return options?.callback?.();
    },
    [dirtyFields, getValues, errors, clearErrors, isDirty]
  );

  return {
    ...form,
    partialSubmit
  };
}

export default useEasiForm;
