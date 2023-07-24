import React, { useCallback, useEffect } from 'react';
import {
  DeepPartial,
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';

import PageLoading from 'components/PageLoading';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';

import ActionForm, { ActionFormProps } from '.';

export interface SystemIntakeActionFields {
  feedback: string;
  note: string;
  recipients: EmailNotificationRecipients;
}

const initialValues: SystemIntakeActionFields = {
  feedback: '',
  note: '',
  recipients: {
    shouldNotifyITGovernance: false,
    shouldNotifyITInvestment: false,
    regularRecipientEmails: []
  }
};

type UseActionFormProps<
  TFieldValues extends SystemIntakeActionFields,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & { systemIntakeId: string };

type UseActionFormReturn<
  TFieldValues extends SystemIntakeActionFields,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & {
  /** Action form wrapper component used to pass form context to recipient fields */
  ActionForm: ({
    title,
    description,
    children
  }: ActionFormProps) => JSX.Element;
};

/**
 * Custom hook for TRB action forms
 */
function useActionForm<
  TFieldValues extends SystemIntakeActionFields = SystemIntakeActionFields,
  TContext = any
>({
  systemIntakeId,
  ...formProps
}: UseActionFormProps<TFieldValues, TContext>): UseActionFormReturn<
  TFieldValues,
  TContext
> {
  const {
    contacts: { data: contacts, loading }
  } = useSystemIntakeContacts(systemIntakeId);

  const form = useForm<TFieldValues, TContext>({
    ...formProps,
    defaultValues: {
      ...initialValues,
      ...formProps.defaultValues
    } as DeepPartial<TFieldValues>
  });

  const {
    reset,
    formState: { defaultValues }
  } = form;

  /** Form wrapper with loading and not found states */
  const FormWrapper = useCallback(
    ({ children, ...props }: ActionFormProps) => {
      if (loading) return <PageLoading />;
      return (
        <ActionForm
          {...props}
          systemIntakeId={systemIntakeId}
          contacts={contacts}
        >
          {children}
        </ActionForm>
      );
    },
    [loading, systemIntakeId, contacts]
  );

  // Reset default values when contacts load
  useEffect(() => {
    if (
      !loading &&
      defaultValues?.recipients?.regularRecipientEmails?.length === 0
    ) {
      reset(
        {
          ...initialValues,
          recipients: {
            regularRecipientEmails: [contacts.requester.email],
            shouldNotifyITGovernance: true,
            shouldNotifyITInvestment: false
          }
        } as TFieldValues,
        { keepDefaultValues: false }
      );
    }
  }, [contacts, loading, defaultValues, reset]);

  return {
    ...form,
    ActionForm: useCallback(
      (props: ActionFormProps) => (
        <FormProvider<TFieldValues, TContext> {...form}>
          <FormWrapper {...props} />
        </FormProvider>
      ),
      [form, FormWrapper]
    )
  };
}

export default useActionForm;
