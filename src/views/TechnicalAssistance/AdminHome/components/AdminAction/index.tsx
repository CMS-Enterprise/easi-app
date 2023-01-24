import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminAction = () => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__admin-action usa-summary-box"
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
    </div>
  );
};

export default AdminAction;
