import React, { useCallback } from 'react';
import {
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';
import NotFound from 'features/Miscellaneous/NotFound';
import { GetTRBRequestAttendeesQuery } from 'gql/legacyGQL/TrbAttendeeQueries';
import {
  GetTRBRequestAttendees,
  GetTRBRequestAttendeesVariables
} from 'gql/legacyGQL/types/GetTRBRequestAttendees';
import { TRBAttendee_userInfo as UserInfo } from 'gql/legacyGQL/types/TRBAttendee';

import PageLoading from 'components/PageLoading';
import { PersonRole } from 'types/graphql-global-types';
import { TrbRecipientFields } from 'types/technicalAssistance';

import ActionForm, { ActionFormProps } from '.';

type UseActionFormProps<
  TFieldValues extends TrbRecipientFields,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & { trbRequestId: string };

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
  userInfo: UserInfo | null;
  component: string | null;
  role: PersonRole | null;
};

/**
 * Custom hook for TRB action forms
 */
function useActionForm<
  TFieldValues extends TrbRecipientFields = TrbRecipientFields,
  TContext = any
>({
  trbRequestId,
  ...formProps
}: UseActionFormProps<TFieldValues, TContext>): UseActionFormReturn<
  TFieldValues,
  TContext
> {
  const [getAttendees, { data }] = useLazyQuery<
    GetTRBRequestAttendees,
    GetTRBRequestAttendeesVariables
  >(GetTRBRequestAttendeesQuery, {
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
          <FormWrapper {...props} />
        </FormProvider>
      ),
      [form, FormWrapper]
    )
  };
}

export default useActionForm;
