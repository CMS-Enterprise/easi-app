import { useCallback } from 'react';
import {
  FieldPath,
  FieldValues,
  RefCallBack,
  RegisterOptions,
  useForm,
  UseFormProps,
  UseFormRegisterReturn,
  UseFormReturn
} from 'react-hook-form';

type PartialSubmitProps<TFieldValues extends FieldValues> = {
  update: (
    /** Object containing valid dirty field values */
    formData: Partial<TFieldValues>
  ) => Promise<any>;
  /** Callback to execute after updating */
  callback?: () => void;
  /** Whether to clear field error messages */
  clearErrors?: boolean;
};

type PartialSubmit<TFieldValues extends FieldValues> = ({
  update,
  clearErrors,
  callback
}: PartialSubmitProps<TFieldValues>) => Promise<void>;

type UseEasiFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: RegisterOptions<TFieldValues, TFieldName>
) => UseFormRegisterReturn<TFieldName> & { inputRef: RefCallBack };

type UseEasiFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = Omit<UseFormReturn<TFieldValues, TContext>, 'register'> & {
  /** Ignore errors and submit valid dirty field values */
  partialSubmit: PartialSubmit<TFieldValues>;
  /** Custom register function that returns `inputRef` for function components */
  register: UseEasiFormRegister<TFieldValues>;
};

/**
 * Extension of React Hook Form's `useForm` hook
 */
function useEasiForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props?: UseFormProps<TFieldValues, TContext>
): UseEasiFormReturn<TFieldValues, TContext> {
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

  /** Custom register function that returns `inputRef` for function components */
  const register: UseEasiFormRegister<TFieldValues> = (name, options) => {
    const field = form.register(name, options);

    return {
      ...field,
      inputRef: field.ref
    };
  };

  return {
    ...form,
    partialSubmit,
    register
  };
}

export default useEasiForm;
