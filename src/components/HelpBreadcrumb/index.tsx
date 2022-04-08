import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, IconArrowBack, IconClose } from '@trussworks/react-uswds';
import classNames from 'classnames';

type HelpBreadcrumbProps = {
  type: 'back' | 'close';
  className?: string;
};

export default function HelpBreadcrumb({
  type = 'back',
  className
}: HelpBreadcrumbProps) {
  const history = useHistory();
  const { t } = useTranslation();
  const handleClick = () => {
    // TODO: Close functionality is broken
    if (type === 'close') {
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
      {type === 'close' ? (
        <IconClose className="margin-right-05 margin-top-3px text-tbottom" />
      ) : (
        <IconArrowBack className="margin-right-05 margin-top-3px text-tbottom" />
      )}
      {t(`${type.charAt(0).toUpperCase()}${type.slice(1)}`)}
    </Button>
  );
}
