import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classnames from 'classnames';

type EmailRecipientsFieldsProps = {
  optional?: boolean;
  className?: string;
  headerClassName?: string;
  alertClassName?: string;
};

export default ({
  optional = true,
  className,
  headerClassName,
  alertClassName
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');

  return (
    <div className={classnames(className)}>
      <h3 className={classnames('margin-y-2', headerClassName)}>
        {t('emailRecipients.email')} {optional && t('emailRecipients.optional')}
      </h3>
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}
    </div>
  );
};
