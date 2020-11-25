import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import { SystemIntakeForm } from 'types/systemIntake';

import './index.scss';

type ApprovedProps = {
  intake: SystemIntakeForm;
};
const Approved = ({ intake }: ApprovedProps) => {
  return (
    <>
      <div className="easi-governance-decision__info">
        <h2 className="margin-top-0">Your business case has been approved.</h2>
        <dl>
          <dt>Project Lifecycle ID</dt>
          <dd className="margin-left-0 font-body-xl text-bold">
            {intake.lcid}
          </dd>
        </dl>
        <p className="text-pre-wrap">{intake.lcidScope}</p>
        {intake.lcidExpiration && (
          <p className="text-bold">
            {`This ID expires on ${intake.lcidExpiration.toLocaleString(
              DateTime.DATE_FULL
            )}`}
          </p>
        )}
      </div>

      {intake.lifecycleNextSteps && (
        <>
          <h3>Next steps</h3>
          <Alert type="info">
            Finish these next steps to complete the governance review process.
          </Alert>

          <p className="text-pre-wrap">{intake.lifecycleNextSteps}</p>
        </>
      )}
      <h3>Help us improve</h3>
      <UswdsLink href="/" target="_blank" rel="oponener noreferrer">
        Tell us what you think of this service
      </UswdsLink>

      <div className="margin-top-4">
        <UswdsLink asCustom={Link} to={`/governance-task-list/${intake.id}`}>
          Return to task list
        </UswdsLink>
      </div>
    </>
  );
};

export default Approved;
