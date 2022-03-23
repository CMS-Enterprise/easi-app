import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';

type EmailRecipientsFieldsProps = {
  optional?: boolean;
};

export default ({ optional }: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');

  return (
    <div>
      <h3 className="margin-y-2">
        {t('emailRecipients.email')} {optional && t('emailRecipients.optional')}
      </h3>
      {!optional && (
        <Alert type="info" slim>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}
    </div>
  );
};
