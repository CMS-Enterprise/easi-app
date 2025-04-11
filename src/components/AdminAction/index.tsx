import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type StateLink = {
  pathname: string;
  state: {
    fromAdmin: boolean;
  };
};

export type AdminActionButton = {
  label: string;
  link?: string | StateLink;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  outline?: boolean;
  unstyled?: boolean;
  disabled?: boolean;
};

type AdminActionProps = {
  type?: 'TRB' | 'ITGov';
  title: string;
  buttons: AdminActionButton[];
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Admin action component for TRB admin home subpages
 */
const AdminAction = ({
  type = 'TRB',
  title,
  description,
  children,
  buttons,
  className
}: AdminActionProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { t: grbReviewT } = useTranslation('grbReview');

  return (
    <div className={classNames('usa-summary-box', className)}>
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {type === 'TRB'
          ? t('adminAction.title')
          : grbReviewT('adminTask.title')}
      </h5>
      <h3 className="margin-y-0">{t(title)}</h3>
      {description && (
        <p className="margin-y-0 line-height-body-5">{t(description)}</p>
      )}
      {children}
      <ButtonGroup className="margin-top-3">
        {buttons.map(button =>
          button.onClick ? (
            <Button
              key={button.label}
              type="button"
              onClick={button.onClick}
              outline={button.outline}
              unstyled={button.unstyled}
              disabled={button.disabled}
            >
              {button.label}
            </Button>
          ) : (
            <UswdsReactLink
              key={button.label}
              to={button.link || ''}
              className={classNames('usa-button', {
                'usa-button--unstyled': button.unstyled,
                'usa-button--outline': button.outline
              })}
            >
              {button.label}
            </UswdsReactLink>
          )
        )}
      </ButtonGroup>
    </div>
  );
};

export default AdminAction;
