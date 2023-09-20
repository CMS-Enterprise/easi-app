import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

interface NotApprovedFields extends SystemIntakeActionFields {}

const NotApproved = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<NotApprovedFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotApprovedFields) => {
    // Execute mutation here
    // mutate(formData);
  };

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
