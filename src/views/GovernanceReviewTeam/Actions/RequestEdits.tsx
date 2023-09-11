import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

interface RequestEditsFields extends SystemIntakeActionFields {}

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<RequestEditsFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: RequestEditsFields) => {
    // Execute mutation here
    // mutate(formData);
    //
    // Uncomment to test error message
    // throw new Error();
  };

  return (
    <FormProvider<RequestEditsFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('requestEdits.title')}
        description={t('requestEdits.description')}
        breadcrumb={t('requestEdits.breadcrumb')}
        successMessage={t('requestEdits.success')}
        modal={{
          title: t('requestEdits.modal.title'),
          content: (
            <Trans
              i18nKey="action:requestEdits.modal.content"
              components={{ p: <p /> }}
              values={{ formName: 'TEST' }}
            />
          )
        }}
        onSubmit={onSubmit}
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default RequestEdits;
