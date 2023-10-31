import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import CreateSystemIntakeActionReopenRequestQuery from 'queries/CreateSystemIntakeActionReopenRequestQuery';
import {
  CreateSystemIntakeActionReopenRequest,
  CreateSystemIntakeActionReopenRequestVariables
} from 'queries/types/CreateSystemIntakeActionReopenRequest';
import { SystemIntakeReopenRequestInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type ReopenRequestFields = NonNullableProps<
  Omit<SystemIntakeReopenRequestInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const ReopenRequest = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');

  const [reopenRequest] = useMutation<
    CreateSystemIntakeActionReopenRequest,
    CreateSystemIntakeActionReopenRequestVariables
  >(CreateSystemIntakeActionReopenRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const form = useForm<ReopenRequestFields>();

  /**
   * Reopen request on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ReopenRequestFields) =>
    reopenRequest({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<ReopenRequestFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.reOpenRequest')}
            systemIntakeId={systemIntakeId}
            state={state}
            decisionState={decisionState}
          />
        }
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default ReopenRequest;
