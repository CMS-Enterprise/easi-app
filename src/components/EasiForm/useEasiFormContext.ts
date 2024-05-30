import { FieldValues, useFormContext } from 'react-hook-form';

import { UseEasiFormReturn } from './types';
import useEasiFormRegister from './useEasiFormRegister';
import useEasiPartialSubmit from './useEasiPartialSubmit';

const useEasiFormContext = <
  TFieldValues extends FieldValues
>(): UseEasiFormReturn<TFieldValues> => {
  const form = useFormContext<TFieldValues>();

  const partialSubmit = useEasiPartialSubmit<TFieldValues>(form);
  const register = useEasiFormRegister<TFieldValues>(form);

  return {
    ...form,
    partialSubmit,
    register
  };
};

export default useEasiFormContext;
