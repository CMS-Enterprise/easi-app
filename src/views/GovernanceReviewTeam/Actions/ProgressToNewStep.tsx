import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './components/ActionForm';

interface ProgressToNewStepFields extends SystemIntakeActionFields {}

const ProgressToNewStep = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<ProgressToNewStepFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ProgressToNewStepFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<ProgressToNewStepFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('progressToNewStep.title')}
        description=""
        breadcrumb=""
        successMessage=""
        onSubmit={onSubmit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default ProgressToNewStep;
