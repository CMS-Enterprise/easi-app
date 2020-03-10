import React from 'react';
import ActionBanner from 'components/shared/ActionBanner';
import './index.scss';

const UpcomingActions = () => {
  return (
    <div className="upcoming-actions">
      <span className="upcoming-actions__header">
        <h1>Upcoming Actions</h1>
        <p>as of timestamp</p>
      </span>
      <ActionBanner
        title="TACO"
        helpfulText="Completing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        buttonLabel="Finish CMS Intake"
      />
      <ActionBanner
        title="BURRITO"
        helpfulText="Completing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        buttonLabel="Finish CMS Intake"
      />
    </div>
  );
};

export default UpcomingActions;
