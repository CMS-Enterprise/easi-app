import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconArrowForward } from '@trussworks/react-uswds';
import classnames from 'classnames';

export default ({
  disabled,
  onClick,
  className
}: React.HTMLProps<HTMLButtonElement>) => {
  const { t } = useTranslation('action');

  return (
    <Button
      type="button"
      unstyled
      className={classnames(
        'margin-top-2',
        {
          'text-gray-30': disabled
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {t('submitAction.completeWithoutEmail')}{' '}
      <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
    </Button>
  );
};
