import React from 'react';

export default function Feedback({ trbRequestId }: { trbRequestId: string }) {
  return (
    <div
      className="trb-admin-home__feedback"
      data-testid="trb-admin-home__feedback"
      id={`trbAdminFeedback-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Feedback</h1>
    </div>
  );
}
