import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';

type AdminActionProps = {
  className?: string;
};

/**
 * Admin action component for TRB admin home subpages
 * TODO: complete work on component - this is just a placeholder
 */
const AdminAction = ({ className }: AdminActionProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className={classNames(
        'trb-admin-home__admin-action usa-summary-box',
        className
      )}
      data-testid="trb-admin-home__admin-action"
    >
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {t('adminAction')}
      </h5>
      <h3 className="margin-y-0">Draft Advice Letter</h3>
      <p className="margin-y-0 line-height-body-5">
        Compile an advice letter for the requester and project team. Once you
        send the advice letter, the requester will get a notification and be
        able to see any recommendations, feedback, and next steps you include.
      </p>
      <CollapsableLink
        id="test"
        className="margin-y-2 text-bold display-flex flex-align-center"
        label="What should I include in the advice letter?"
      >
        Test link content
      </CollapsableLink>
      <div className="margin-top-4">
        <UswdsReactLink
          to="/"
          className="usa-button margin-right-2"
          variant="unstyled"
        >
          {t('Continue advice letter')}
        </UswdsReactLink>
        <UswdsReactLink to="/">{t('or, close this request')}</UswdsReactLink>
      </div>
    </div>
  );
};

export default AdminAction;
