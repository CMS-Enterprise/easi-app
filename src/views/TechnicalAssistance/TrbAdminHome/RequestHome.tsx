import React from 'react';

export default function RequestHome({
  trbRequestId
}: {
  trbRequestId: string;
}) {
  return (
    <div
      className="trb-admin-home__request-home"
      data-testid="trb-admin-home__request-home"
      id={`trbAdminRequestHome-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Request home</h1>
    </div>
  );
}
