import React from 'react';

export default function InitialRequestForm({
  trbRequestId
}: {
  trbRequestId: string;
}) {
  return (
    <div
      className="trb-admin-home__initial-request-form"
      data-testid="trb-admin-home__initial-request-form"
      id={`trbAdminInitialRequestForm-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Initial request form</h1>
    </div>
  );
}
