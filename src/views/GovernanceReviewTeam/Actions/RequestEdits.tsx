import React from 'react';
import { useTranslation } from 'react-i18next';

import useActionForm from './ActionFormWrapper/useActionForm';

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const { ActionForm, handleSubmit } = useActionForm({ systemIntakeId });

  const submit = handleSubmit(() => null);

  return (
    <ActionForm
      title={t('requestEdits.title')}
      description={t('requestEdits.description')}
      breadcrumbItems={[{ text: t('requestEdits.breadcrumb') }]}
      onSubmit={submit}
    />
  );
};

export default RequestEdits;
