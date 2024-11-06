import { FieldValues, FormProvider } from 'react-hook-form';

import { EasiFormProviderProps } from './types';

/**
 * Extension of React Hook Form's `FormProvider` component
 *
 * For use with forms created with `useEasiForm`
 */
const EasiFormProvider = <TFieldValues extends FieldValues, TContext = any>(
  props: EasiFormProviderProps<TFieldValues, TContext>
): JSX.Element => FormProvider<TFieldValues, TContext>(props);

export default EasiFormProvider;
