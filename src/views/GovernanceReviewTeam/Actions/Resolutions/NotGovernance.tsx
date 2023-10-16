import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import CreateSystemIntakeActionNotITGovRequestQuery from 'queries/CreateSystemIntakeActionNotITGovRequestQuery';
import {
  CreateSystemIntakeActionNotITGovRequest,
  CreateSystemIntakeActionNotITGovRequestVariables
} from 'queries/types/CreateSystemIntakeActionNotITGovRequest';
import { SystemIntakeNotITGovReqInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type NotGovernanceFields = NonNullableProps<
  Omit<SystemIntakeNotITGovReqInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const NotGovernance = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<NotGovernanceFields>();

  const [mutate] = useMutation<
    CreateSystemIntakeActionNotITGovRequest,
    CreateSystemIntakeActionNotITGovRequestVariables
  >(CreateSystemIntakeActionNotITGovRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  /**
   * Mark as not IT Gov request on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotGovernanceFields) =>
    mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<NotGovernanceFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.notItRequest')}
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

export default NotGovernance;
