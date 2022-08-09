import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, IconArrowBack, IconClose } from '@trussworks/react-uswds';
import classNames from 'classnames';

type HelpBreadcrumbProps = {
  type: 'Back' | 'Close tab';
  className?: string;
  text?: string;
};

export default function HelpBreadcrumb({
  type = 'Back',
  className,
  text
}: HelpBreadcrumbProps) {
  const history = useHistory();
  const { t } = useTranslation();
  const handleClick = () => {
    if (type === 'Close tab') {
      window.close();
    } else {
      history.goBack();
    }
  };
  return (
    <Button
      type="button"
      unstyled
      onClick={() => handleClick()}
      className={classNames('margin-top-6', className)}
    >
      {type === 'Close tab' ? (
        <IconClose className="margin-right-05 margin-top-3px text-tbottom" />
      ) : (
        <IconArrowBack className="margin-right-05 margin-top-3px text-tbottom" />
      )}
      {text ?? t(type)}
    </Button>
  );
}
