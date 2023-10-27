import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import CreateSystemIntakeActionRejectIntakeQuery from 'queries/CreateSystemIntakeActionRejectIntakeQuery';
import {
  CreateSystemIntakeActionRejectIntake,
  CreateSystemIntakeActionRejectIntakeVariables
} from 'queries/types/CreateSystemIntakeActionRejectIntake';
import { SystemIntakeRejectIntakeInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type NotApprovedFields = NonNullableProps<
  Omit<SystemIntakeRejectIntakeInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const NotApproved = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<NotApprovedFields>();

  const [rejectIntake] = useMutation<
    CreateSystemIntakeActionRejectIntake,
    CreateSystemIntakeActionRejectIntakeVariables
  >(CreateSystemIntakeActionRejectIntakeQuery);

  /**
   * Reject intake on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotApprovedFields) =>
    rejectIntake({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<NotApprovedFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.notApproved')}
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

export default NotApproved;
