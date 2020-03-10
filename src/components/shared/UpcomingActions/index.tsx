import React from 'react';
import './index.scss';

type UpcomingActionsProps = {
  children: any;
  timestamp: string;
};

const UpcomingActions = ({ children, timestamp }: UpcomingActionsProps) => {
  return (
    <div className="upcoming-actions">
      <span className="upcoming-actions__header">
        <h1>Upcoming Actions</h1>
        <p>as of {timestamp}</p>
      </span>
      {children}
    </div>
  );
};

export default UpcomingActions;
