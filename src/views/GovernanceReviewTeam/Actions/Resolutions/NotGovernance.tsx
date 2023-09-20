import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

interface NotGovernanceFields extends SystemIntakeActionFields {}

const NotGovernance = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<NotGovernanceFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotGovernanceFields) => {
    // Execute mutation here
    // mutate(formData);
  };

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
