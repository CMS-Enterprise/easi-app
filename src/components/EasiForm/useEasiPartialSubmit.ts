import { useCallback } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { EasiPartialSubmit } from './types';

/** Returns partial submit function for `useEasiForm` */
const useEasiPartialSubmit = <TFieldValues extends FieldValues = FieldValues>(
  form: UseFormReturn<TFieldValues>
): EasiPartialSubmit<TFieldValues> =>
  useCallback(
    async ({ update, callback, clearErrors = true }) => {
      // Clear field errors
      if (clearErrors) form.clearErrors();

      if (form.formState.isDirty) {
        const dirtyFieldKeys = Object.keys(form.formState.dirtyFields)
          // Filter out fields with errors
          .filter(key => !form.formState.errors[key]);

        const values = form.getValues();

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
    [form]
  );

export default useEasiPartialSubmit;
