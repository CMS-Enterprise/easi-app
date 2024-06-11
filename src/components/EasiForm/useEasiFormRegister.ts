import { useCallback } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { EasiFormRegister } from './types';

/**
 * Returns custom register function for `useEasiForm`
 *
 * Includes `fieldRef` property
 */
const useEasiFormRegister = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>
): EasiFormRegister<TFieldValues> =>
  useCallback(
    (name, options) => {
      const field = form.register(name, options);

      return {
        ...field,
        inputRef: field.ref
      };
    },
    [form]
  );

export default useEasiFormRegister;
