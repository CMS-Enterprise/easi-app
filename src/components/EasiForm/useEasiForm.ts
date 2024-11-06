import { FieldValues, useForm, UseFormProps } from 'react-hook-form';

import { UseEasiFormReturn } from './types';
import useEasiFormRegister from './useEasiFormRegister';
import useEasiPartialSubmit from './useEasiPartialSubmit';

/**
 * Extension of React Hook Form's `useForm` hook
 */
const useEasiForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props?: UseFormProps<TFieldValues, TContext>
): UseEasiFormReturn<TFieldValues, TContext> => {
  const form = useForm<TFieldValues, TContext>(props);

  /** Ignore errors and submit valid dirty field values */
  const partialSubmit = useEasiPartialSubmit<TFieldValues>(form);

  /** Custom register function that returns inputRef for function components */
  const register = useEasiFormRegister<TFieldValues>(form);

  return {
    ...form,
    partialSubmit,
    register
  };
};

export default useEasiForm;
