import React from 'react';

import './index.scss';

type UpcomingActionsProps = {
  children: any;
  timestamp: string | null;
};

const UpcomingActions = ({ children, timestamp }: UpcomingActionsProps) => {
  return (
    <div className="upcoming-actions">
      <span className="upcoming-actions__header">
        <h1>Upcoming Actions</h1>
        <span className="timestamp">as of {timestamp}</span>
      </span>
      {children}
    </div>
  );
};

export default UpcomingActions;
