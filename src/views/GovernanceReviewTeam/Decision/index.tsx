import React from 'react';
import { DateTime } from 'luxon';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { SystemIntakeForm } from 'types/systemIntake';

type DecisionProps = {
  systemIntake: SystemIntakeForm;
};

const Decision = ({ systemIntake }: DecisionProps) => {
  const Approved = () => (
    <>
      <h1>Decision - Accepted</h1>
      <DescriptionList title="Decision Details">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Lifecycle ID" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.lcid}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Lifecycle ID Expiration" />
            <DescriptionDefinition
              definition={
                systemIntake.lcidExpiration
                  ? systemIntake.lcidExpiration.toLocaleString(
                      DateTime.DATE_FULL
                    )
                  : ''
              }
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Lifecycle ID Scope" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.lcidScope}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Next Steps" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.decisionNextSteps}
            />
          </div>
        </ReviewRow>
      </DescriptionList>
    </>
  );

  const Rejected = () => (
    <>
      <h1>Decision - Rejected</h1>
      <DescriptionList title="Decision Details">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Rejection Reason" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.rejectionReason}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Next Steps" />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.decisionNextSteps}
            />
          </div>
        </ReviewRow>
      </DescriptionList>
    </>
  );

  const NotItRequest = () => (
    <>
      <h1>Decision - Closed</h1>
      <p>Request was marked &quot;Not an IT Request&quot; </p>
    </>
  );

  const NoGovernance = () => (
    <>
      <h1>Decision - Closed</h1>
      <p>REquest was marked &quot;No further governance needed&quot;</p>
    </>
  );

  if (systemIntake.status === 'LCID_ISSUED') {
    return <Approved />;
  }

  if (systemIntake.status === 'NOT_APPROVED') {
    return <Rejected />;
  }

  if (systemIntake.status === 'NOT_IT_REQUEST') {
    return <NotItRequest />;
  }

  if (systemIntake.status === 'NO_GOVERNANCE') {
    return <NoGovernance />;
  }

  return (
    <h1>
      <h1> Decision</h1>
      <p>Decision not yet made</p>
    </h1>
  );
};

export default Decision;
