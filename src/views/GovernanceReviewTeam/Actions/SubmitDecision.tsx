import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

interface SubmitDecisionFields extends SystemIntakeActionFields {}

const SubmitDecision = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<SubmitDecisionFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: SubmitDecisionFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<SubmitDecisionFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('decision.title')}
        description=""
        breadcrumb=""
        onSubmit={onSubmit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default SubmitDecision;
