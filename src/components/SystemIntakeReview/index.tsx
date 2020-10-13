import React from 'react';
import { DateTime } from 'luxon';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { yesNoMap } from 'data/common';
import { SystemIntakeForm } from 'types/systemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';

type SystemIntakeReview = {
  systemIntake: SystemIntakeForm;
};

export const SystemIntakeReview = ({ systemIntake }: SystemIntakeReview) => {
  const fundingDefinition = () => {
    const isFunded = convertBoolToYesNo(systemIntake.fundingSource.isFunded);
    if (systemIntake.fundingSource.isFunded) {
      return `${isFunded}, ${systemIntake.fundingSource.fundingNumber}`;
    }
    return isFunded;
  };
  const issoDefinition = () => {
    const hasIsso = convertBoolToYesNo(systemIntake.isso.isPresent);
    if (systemIntake.isso.isPresent) {
      return `${hasIsso}, ${systemIntake.isso.name}`;
    }
    return hasIsso;
  };
  const expectedCosts = () => {
    const {
      costs: { expectedIncreaseAmount, isExpectingIncrease }
    } = systemIntake;
    if (expectedIncreaseAmount) {
      return `${yesNoMap[isExpectingIncrease]}, ${expectedIncreaseAmount}`;
    }
    return yesNoMap[isExpectingIncrease];
  };
  return (
    <div>
      <DescriptionList title="System Request">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Submission Date" />
            {/* TO DO Make this changeable */}
            <DescriptionDefinition
              definition={DateTime.local().toLocaleString(DateTime.DATE_MED)}
            />
          </div>
        </ReviewRow>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Contact Details</h2>

      <DescriptionList title="Contact Details">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Requester" />
            <DescriptionDefinition definition={systemIntake.requester.name} />
          </div>
          <div>
            <DescriptionTerm term="Requester Component" />
            <DescriptionDefinition
              definition={systemIntake.requester.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="CMS Business/Product Owner's Name" />
            <DescriptionDefinition
              definition={systemIntake.businessOwner.name}
            />
          </div>
          <div>
            <DescriptionTerm term="Business Owner Component" />
            <DescriptionDefinition
              definition={systemIntake.businessOwner.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="CMS Project/Product Manager or lead" />
            <DescriptionDefinition
              definition={systemIntake.productManager.name}
            />
          </div>
          <div>
            <DescriptionTerm term="CMS Project/Product manager or lead Component" />
            <DescriptionDefinition
              definition={systemIntake.productManager.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Does your project have an Information System Security Officer (ISSO)?" />
            <DescriptionDefinition definition={issoDefinition()} />
          </div>
          <div>
            <DescriptionTerm term="I have started collaborating with" />
            {systemIntake.governanceTeams.isPresent ? (
              systemIntake.governanceTeams.teams.map(team => (
                <DescriptionDefinition
                  key={`GovernanceTeam-${team.name.split(' ').join('-')}`}
                  definition={`${team.name}, ${team.collaborator}`}
                />
              ))
            ) : (
              <DescriptionDefinition definition="N/A" />
            )}
          </div>
        </ReviewRow>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Request Details</h2>

      <DescriptionList title="Request Details">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Project Name" />
            <DescriptionDefinition definition={systemIntake.requestName} />
          </div>
        </ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="What is your business need?" />
            <DescriptionDefinition
              className="text-pre"
              definition={systemIntake.businessNeed}
            />
          </div>
        </div>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="How are you thinking of solving it?" />
            <DescriptionDefinition
              className="text-pre"
              definition={systemIntake.businessSolution}
            />
          </div>
        </div>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Do you need Enterprise Architecture (EA) support?" />
            <DescriptionDefinition
              definition={convertBoolToYesNo(systemIntake.needsEaSupport)}
            />
          </div>
        </ReviewRow>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Contract Details</h2>

      <DescriptionList title="Contract Details">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Where are you in the process?" />
            <DescriptionDefinition definition={systemIntake.currentStage} />
          </div>
          <div>
            <DescriptionTerm term="Do you currently have a contract in place?" />
            <DescriptionDefinition definition={systemIntake.hasContract} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Does the project have funding?" />
            <DescriptionDefinition definition={fundingDefinition()} />
          </div>
          <div>
            <DescriptionTerm term="Do you expect costs for this request to increase?" />
            <DescriptionDefinition definition={expectedCosts()} />
          </div>
        </ReviewRow>
      </DescriptionList>
    </div>
  );
};
export default SystemIntakeReview;
