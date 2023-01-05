import React from 'react';

export default function Notes({ trbRequestId }: { trbRequestId: string }) {
  return (
    <div
      className="trb-admin-home__notes"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Notes</h1>
    </div>
  );
}
