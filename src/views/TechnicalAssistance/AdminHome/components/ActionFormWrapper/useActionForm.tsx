import React, { useCallback } from 'react';
import {
  FormProvider,
  FormState,
  useForm,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';

import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import {
  GetTRBRequestAttendees,
  GetTRBRequestAttendeesVariables
} from 'queries/types/GetTRBRequestAttendees';
import { TRBAttendee_userInfo as UserInfo } from 'queries/types/TRBAttendee';
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

// type Recipients = { recipients: TrbRecipient[] };

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
  const [getAttendees] = useLazyQuery<
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
        response?.data?.trbRequest.attendees || []
      ).map(({ id, userInfo, component, role }) => ({
        id,
        userInfo,
        component,
        role
      }));

      const requesterEuaId = attendees[0]?.userInfo?.euaUserId;

      const defaultValues = ({
        ...formProps?.defaultValues,
        notifyEuaIds: [requesterEuaId],
        recipients: attendees
      } as unknown) as ActionFormFields<TFieldValues>;

      return defaultValues;
    }
  });

  return {
    ...form,
    ActionForm: useCallback(
      ({ children, ...props }: ActionFormProps) => (
        <FormProvider<ActionFormFields<TFieldValues>, TContext> {...form}>
          <ActionForm {...props}>{children}</ActionForm>
        </FormProvider>
      ),
      [form]
    )
  };
}

export default useActionForm;
