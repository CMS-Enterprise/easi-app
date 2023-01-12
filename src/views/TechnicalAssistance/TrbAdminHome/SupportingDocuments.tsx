import React from 'react';

export default function SupportingDocuments({
  trbRequestId
}: {
  trbRequestId: string;
}) {
  return (
    <div
      className="trb-admin-home__documents"
      data-testid="trb-admin-home__documents"
      id={`trbAdminSupportingDocuments-${trbRequestId}`}
    >
      <h1 className="margin-y-0">Supporting documents</h1>
    </div>
  );
}
