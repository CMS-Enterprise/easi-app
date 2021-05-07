import React from 'react';

import { Step, StepBody, StepHeading, StepList } from './index';

export default {
  title: 'Step List',
  component: StepList
};

export const Default = () => {
  return (
    <div className="tablet:grid-col-6">
      <StepList>
        <Step>
          <StepHeading>Fill the intake request form</StepHeading>
          <StepBody>
            <p className="margin-0">
              Tell the Governance admin team about your project/idea.
            </p>
          </StepBody>
        </Step>
        <Step>
          <StepHeading>Feedback from initial review</StepHeading>
          <StepBody>
            <p className="margin-0">
              The Governance admin team will review your intake request form and
              decide if it it needs further governance. If it does, they’ll
              direct you to go through the remaining steps.
            </p>
          </StepBody>
        </Step>
        <Step>
          <StepHeading>Prepare your business case</StepHeading>
          <StepBody>
            <p className="margin-0">
              Draft different solutions and the corresponding costs involved.
            </p>
          </StepBody>
        </Step>
        <Step>
          <StepHeading>Attend the Governance Review Team meeting</StepHeading>
          <StepBody>
            <p className="margin-0">
              Discuss your draft business case with Governance Review Team. They
              will help you refine your business case into the best shape
              possible.
            </p>
          </StepBody>
        </Step>
        <Step>
          <StepHeading>Feedback from the Governance Review Team</StepHeading>
          <StepBody>
            <p className="margin-0">
              If the Governance Review Team has any additional comments, they
              will ask you to update your business case before it’s submitted to
              the Governance Review Board.
            </p>
          </StepBody>
        </Step>
      </StepList>
    </div>
  );
};
