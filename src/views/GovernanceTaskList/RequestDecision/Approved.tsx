import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import CollapsableLink from 'components/shared/CollapsableLink';
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
        <p>
          This lifecycle ID lets you explore the solution and a proof of
          concept. Once that is done, your project team will need another review
          and approval.
        </p>
        {intake.lcidExpiration && (
          <p className="text-bold">
            {`This ID expires on ${intake.lcidExpiration.toLocaleString(
              DateTime.DATE_FULL
            )}`}
          </p>
        )}
        <CollapsableLink
          className="easi-governance-decision__accordion"
          id="Decision-LifecycleExpiration"
          label="Why does my Lifecycle ID have an expiration?"
        >
          <div />
        </CollapsableLink>
      </div>

      <h3>Next steps</h3>
      <Alert type="info">
        Finish these next steps to complete the governance review process.
      </Alert>

      <h4>Update the CMS Portfolio Management Tool (PMT)</h4>
      <p className="line-height-body-4">
        In order to achieve compliance with OMB rules, the current state of this
        effort should be reflected in the appropriate Investment(s) in the CMS
        Portfolio Management Tool (PMT). You should also update that
        Investment’s Acquisition Strategy, if applicable, to reflect this
        effort, ensuring alignment of your Acquisition Plan(s)/Interagency
        Agreement with your Acquisition Strategy. For any questions, please
        contact IT_Investments@cms.hhs.gov.
      </p>
      <UswdsLink href="/" target="_blank" rel="oponener noreferrer">
        Update the Portfolio Management Tool
      </UswdsLink>

      <h4>Update your System Profile</h4>
      <p className="line-height-body-4">
        Update your System Profile in the CMS System Census to baseline the
        project, and continuously update the Profile as you develop the system
        and/or begin planning for any system changes.
      </p>
      <UswdsLink href="/" target="_blank" rel="oponener noreferrer">
        Set up system profile
      </UswdsLink>

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
