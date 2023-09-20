import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

interface CloseRequestFields extends SystemIntakeActionFields {}

const CloseRequest = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<CloseRequestFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: CloseRequestFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<CloseRequestFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.closeRequest')}
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

export default CloseRequest;
