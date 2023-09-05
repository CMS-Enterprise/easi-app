import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<SystemIntakeActionFields>();

  const { handleSubmit, setError } = form;

  const submit = handleSubmit(() => {
    // Set root error from failed mutation
    setError('root', { message: t('error') });

    // mutate().catch(e => setError('root', , { message: t('error') }))
  });

  return (
    <FormProvider<SystemIntakeActionFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('requestEdits.title')}
        description={t('requestEdits.description')}
        breadcrumb={t('requestEdits.breadcrumb')}
        onSubmit={submit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default RequestEdits;
