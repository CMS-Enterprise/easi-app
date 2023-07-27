import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

const SubmitDecision = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<SystemIntakeActionFields>();

  const { handleSubmit } = form;

  const submit = handleSubmit(() => null);

  return (
    <FormProvider<SystemIntakeActionFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('decision.title')}
        description=""
        breadcrumb=""
        onSubmit={submit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default SubmitDecision;
