import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

export type AdminActionButton = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  outline?: boolean;
  unstyled?: boolean;
};

type AdminActionProps = {
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
  title,
  description,
  children,
  buttons,
  className
}: AdminActionProps) => {
  const { t } = useTranslation('technicalAssistance');

  return (
    <div className={classNames('usa-summary-box', className)}>
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {t('adminAction.title')}
      </h5>
      <h3 className="margin-y-0">{t(title)}</h3>
      {description && (
        <p className="margin-y-0 line-height-body-5">{t(description)}</p>
      )}
      {children}
      <ButtonGroup className="margin-top-3">
        {buttons.map(button => (
          <Button
            key={button.label}
            type="button"
            onClick={button.onClick}
            outline={button.outline}
            unstyled={button.unstyled}
          >
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default AdminAction;
