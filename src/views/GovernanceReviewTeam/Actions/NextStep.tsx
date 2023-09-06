import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

interface NextStepFields extends SystemIntakeActionFields {}

const NextStep = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<NextStepFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NextStepFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<NextStepFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('nextStep.title')}
        description=""
        breadcrumb=""
        onSubmit={onSubmit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default NextStep;
