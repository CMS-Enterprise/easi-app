import { FieldValues, FormProvider } from 'react-hook-form';

import { EasiFormProviderProps } from './types';

const EasiFormProvider = <TFieldValues extends FieldValues, TContext = any>(
  props: EasiFormProviderProps<TFieldValues, TContext>
): JSX.Element => FormProvider<TFieldValues, TContext>(props);

export default EasiFormProvider;
