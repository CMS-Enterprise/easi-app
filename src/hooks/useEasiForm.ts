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

type PartialSubmit<TFieldValues extends FieldValues> = ({
  update,
  clearErrors,
  callback
}: {
  update: (
    /** Object containing valid dirty field values */
    formData: Partial<TFieldValues>
  ) => Promise<any>;
  /** Callback to execute after updating */
  callback?: () => void;
  /** Whether to clear field error messages */
  clearErrors?: boolean;
}) => Promise<void>;

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
    formState: { errors, dirtyFields, isDirty }
  } = form;

  /** Ignore errors and submit valid dirty field values */
  const partialSubmit: PartialSubmit<TFieldValues> = useCallback(
    async ({ update, callback, clearErrors = true }) => {
      // Clear field errors
      if (clearErrors) form.clearErrors();

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
            .then(() => callback?.())
            // Ignore errors and execute callback
            .catch(() => callback?.())
        );
      }

      return callback?.();
    },
    [dirtyFields, getValues, errors, form, isDirty]
  );

  return {
    ...form,
    partialSubmit
  };
}

export default useEasiForm;
