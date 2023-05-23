import React, { useCallback } from 'react';
import {
  FormProvider,
  FormState,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';

import PageLoading from 'components/PageLoading';
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import {
  GetTRBRequestAttendees,
  GetTRBRequestAttendeesVariables
} from 'queries/types/GetTRBRequestAttendees';
import { TRBAttendee_userInfo as UserInfo } from 'queries/types/TRBAttendee';
import { PersonRole } from 'types/graphql-global-types';
import { TrbRecipientFields } from 'types/technicalAssistance';
import NotFound from 'views/NotFound';

import ActionForm, { ActionFormProps } from '.';

type UseActionFormProps<
  TFieldValues extends TrbRecipientFields,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & { trbRequestId: string };

type UseActionFormReturn<
  TFieldValues extends TrbRecipientFields,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & {
  formState: FormState<TFieldValues> & {
    isLoading: boolean;
  };
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

export type ActionFormFields<
  TFieldValues extends TrbRecipientFields = TrbRecipientFields
> = TFieldValues & { recipients: TrbRecipient[] };

function useActionForm<
  TFieldValues extends TrbRecipientFields = TrbRecipientFields,
  TContext = any
>({
  trbRequestId,
  ...formProps
}: UseActionFormProps<
  ActionFormFields<TFieldValues>,
  TContext
>): UseActionFormReturn<ActionFormFields<TFieldValues>, TContext> {
  const [getAttendees, { data }] = useLazyQuery<
    GetTRBRequestAttendees,
    GetTRBRequestAttendeesVariables
  >(GetTRBRequestAttendeesQuery, {
    variables: { id: trbRequestId }
  });

  const form = useForm<ActionFormFields<TFieldValues>, TContext>({
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

      const defaultValues = ({
        ...formProps?.defaultValues,
        notifyEuaIds: [...(requesterEuaId ? [requesterEuaId] : [])],
        recipients: attendees
      } as unknown) as ActionFormFields<TFieldValues>;

      return defaultValues;
    }
  });

  const {
    formState: { isLoading }
  } = form;

  const FormWrapper = useCallback(
    ({ children, ...props }: ActionFormProps) => {
      if (isLoading) return <PageLoading />;
      if (!data?.trbRequest) return <NotFound />;
      return <ActionForm {...props}>{children}</ActionForm>;
    },
    [data?.trbRequest, isLoading]
  );

  return {
    ...form,
    ActionForm: useCallback(
      (props: ActionFormProps) => (
        <FormProvider<ActionFormFields<TFieldValues>, TContext> {...form}>
          <FormWrapper {...props} />
        </FormProvider>
      ),
      [form, FormWrapper]
    )
  };
}

export default useActionForm;
