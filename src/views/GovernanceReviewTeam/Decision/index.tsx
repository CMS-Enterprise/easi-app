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
                ? systemIntake.lcidExpiration.toLocaleString(DateTime.DATE_FULL)
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
  );

  const Rejected = () => (
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
  );

  return (
    <>
      <h1>
        Decision -{' '}
        {systemIntake.status === 'LCID_ISSUED' ? 'Approved' : 'Rejected'}
      </h1>
      {systemIntake.status === 'LCID_ISSUED' && <Approved />}
      {systemIntake.status === 'NOT_APPROVED' && <Rejected />}
    </>
  );
};

export default Decision;
