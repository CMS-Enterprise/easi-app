import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionFormWrapper';

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<SystemIntakeActionFields>();

  const { handleSubmit } = form;

  const submit = handleSubmit(() => null);

  return (
    <FormProvider<SystemIntakeActionFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('requestEdits.title')}
        description={t('requestEdits.description')}
        breadcrumb={t('requestEdits.breadcrumb')}
        onSubmit={submit}
      />
    </FormProvider>
  );
};

export default RequestEdits;
