import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import useAdminActionStatus from './useAdminActionStatus';

type AdminActionProps = {
  trbRequestId: string;
  className?: string;
};

/**
 * Admin action component for TRB admin home subpages
 * TODO: complete work on component - this is just a placeholder
 */
const AdminAction = ({ trbRequestId, className }: AdminActionProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { pathname } = useLocation();

  const subpageKey = pathname.split('/')[3];

  const status = useAdminActionStatus();

  if (!status) return null;

  const actionButtons = status.buttons[subpageKey];

  return (
    <div
      className={classNames(
        'trb-admin-home__admin-action usa-summary-box',
        className
      )}
      data-testid="trb-admin-home__admin-action"
    >
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {t('adminAction.title')}
      </h5>
      <h3 className="margin-y-0">{status.title}</h3>
      <p className="margin-y-0 line-height-body-5">{status.description}</p>
      {/* <CollapsableLink
        id="test"
        className="margin-y-2 text-bold display-flex flex-align-center"
        label="What should I include in the advice letter?"
      >
        Test link content
      </CollapsableLink> */}
      <ButtonGroup className="margin-top-4">
        {actionButtons.map(button => (
          <Button
            key={button.label}
            type="button"
            onClick={button.onClick}
            outline={button.outline}
          >
            {button.label}
          </Button>
        ))}
        {status.showCloseRequest && (
          <UswdsReactLink to="/">{t('or, close this request')}</UswdsReactLink>
        )}
      </ButtonGroup>
    </div>
  );
};

export default AdminAction;
