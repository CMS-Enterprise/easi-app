import React from 'react';
import { Link, useParams } from 'react-router-dom';

const IssueLifecycleId = () => {
  const { systemId } = useParams();

  const backLink = `/governance-review-team/${systemId}/actions`;

  return (
    <>
      <h1>Actions on System Intake</h1>
      <p>
        Approve request and issue Lifecycle ID <Link to={backLink}>Change</Link>
      </p>
    </>
  );
};

export default IssueLifecycleId;
