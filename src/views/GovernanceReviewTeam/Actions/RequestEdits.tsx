import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import useMessage from 'hooks/useMessage';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');
  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();

  const form = useForm<SystemIntakeActionFields>();

  const {
    handleSubmit
    // setError
  } = form;

  const submit = handleSubmit(() => {
    // Set root error from failed mutation
    // setError('root', { message: t('error') });
    // mutate().catch(e => setError('root', , { message: t('error') }))

    // Success message
    showMessageOnNextPage(t('requestEdits.success'), { type: 'success' });
    history.push(`/governance-review-team/${systemIntakeId}/actions`);
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
