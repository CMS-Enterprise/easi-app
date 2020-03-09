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
      <ActionBanner />
      <ActionBanner />
    </div>
  );
};

export default UpcomingActions;
