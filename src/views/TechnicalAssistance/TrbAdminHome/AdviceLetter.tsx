import React from 'react';

export default function AdviceLetter({
  trbRequestId
}: {
  trbRequestId: string;
}) {
  return (
    <div
      className="trb-admin-home__advice"
      data-testid="trb-admin-home__advice"
      id={`trbAdminAdviceLetter-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Advice letter</h1>
    </div>
  );
}
