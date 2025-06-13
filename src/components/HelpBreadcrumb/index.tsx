import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

type HelpBreadcrumbProps = {
  type?: 'back' | 'close';
  className?: string;
  text?: string;
};

export default function HelpBreadcrumb({
  type = 'back',
  className,
  text
}: HelpBreadcrumbProps) {
  const history = useHistory();
  const { t } = useTranslation('help');
  const handleClick = () => {
    if (type === 'close') {
      window.close();
    } else {
      history.push('/help');
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
        <Icon.Close
          className="margin-right-05 margin-top-3px text-tbottom"
          aria-hidden
        />
      ) : (
        <Icon.ArrowBack
          className="margin-right-05 margin-top-3px text-tbottom"
          aria-hidden
        />
      )}
      {text ?? t(type)}
    </Button>
  );
}
