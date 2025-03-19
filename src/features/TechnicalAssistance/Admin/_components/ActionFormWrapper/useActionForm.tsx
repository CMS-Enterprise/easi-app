import React, { useCallback } from 'react';
import {
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  GetTRBRequestAttendeesQuery,
  PersonRole,
  useGetTRBRequestAttendeesLazyQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import { TrbRecipientFields } from 'types/technicalAssistance';

import ActionForm, { ActionFormProps } from '.';

type UseActionFormProps<
  TFieldValues extends TrbRecipientFields,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & {
  trbRequestId: string;
  copyITGovMailbox?: boolean;
};

type UseActionFormReturn<
  TFieldValues extends TrbRecipientFields,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & {
  /** Action form wrapper component used to pass form context to recipient fields */
  ActionForm: ({
    title,
    description,
    children
  }: ActionFormProps) => JSX.Element;
};

type TrbRecipient = {
  id?: string;
  userInfo:
    | GetTRBRequestAttendeesQuery['trbRequest']['attendees'][0]['userInfo']
    | null;
  component: string | null | undefined;
  role: PersonRole | null | undefined;
};

/**
 * Custom hook for TRB action forms
 */
function useActionForm<
  TFieldValues extends TrbRecipientFields = TrbRecipientFields,
  TContext = any
>({
  trbRequestId,
  copyITGovMailbox,
  ...formProps
}: UseActionFormProps<TFieldValues, TContext>): UseActionFormReturn<
  TFieldValues,
  TContext
> {
  const [getAttendees, { data }] = useGetTRBRequestAttendeesLazyQuery({
    variables: { id: trbRequestId }
  });

  const form = useForm<TFieldValues, TContext>({
    ...formProps,
    defaultValues: async () => {
      const response = await getAttendees();

      const attendees: TrbRecipient[] = (
        response?.data?.trbRequest?.attendees || []
      ).map(({ id, userInfo, component, role }) => ({
        id,
        userInfo,
        component,
        role
      }));

      const requesterEuaId = attendees[0]?.userInfo?.euaUserId;

      return {
        copyTrbMailbox: true,
        copyITGovMailbox,
        ...formProps?.defaultValues,
        notifyEuaIds: [...(requesterEuaId ? [requesterEuaId] : [])],
        recipients: attendees
      } as unknown as TFieldValues;
    }
  });

  const {
    handleSubmit,
    formState: { isLoading }
  } = form;

  /** Form wrapper with loading and not found states */
  const FormWrapper = useCallback(
    ({ children, ...props }: ActionFormProps) => {
      if (isLoading) return <PageLoading />;
      if (!data?.trbRequest) return <NotFound />;
      return <ActionForm {...props}>{children}</ActionForm>;
    },
    [data?.trbRequest, isLoading]
  );

  return {
    // Adjust type to remove recipients field from form return
    ...(form as UseFormReturn<TFieldValues>),
    // Refactor handleSubmit to remove recipients from returned values
    handleSubmit: (onValid, onInvalid) =>
      handleSubmit(formData => {
        const values = { ...formData } as TFieldValues & {
          recipients?: TrbRecipient[];
        };
        delete values.recipients;

        return onValid(values as TFieldValues);
      }, onInvalid),
    ActionForm: useCallback(
      (props: ActionFormProps) => (
        <FormProvider<TFieldValues, TContext> {...form}>
          <FormWrapper {...props} copyITGovMailbox={copyITGovMailbox} />
        </FormProvider>
      ),
      [form, FormWrapper, copyITGovMailbox]
    )
  };
}

export default useActionForm;
