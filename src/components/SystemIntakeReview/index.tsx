import React from 'react';
import { DateTime } from 'luxon';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { SystemIntakeForm } from 'types/systemIntake';

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
            <DescriptionTerm term="CMS Bidness/Product Owner's Name" />
            <DescriptionDefinition
              definition={systemIntake.bidnessOwner.name}
            />
          </div>
          <div>
            <DescriptionTerm term="Bidness Owner Component" />
            <DescriptionDefinition
              definition={systemIntake.bidnessOwner.component}
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
            <DescriptionTerm term="Request Name" />
            <DescriptionDefinition definition={systemIntake.requestName} />
          </div>
        </ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="What is your bidness need?" />
            <DescriptionDefinition definition={systemIntake.bidnessNeed} />
          </div>
        </div>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="How are you thinking of solving it?" />
            <DescriptionDefinition definition={systemIntake.bidnessSolution} />
          </div>
        </div>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Do you need Enterprise Architecture (EA) support?" />
            <DescriptionDefinition
              definition={convertBoolToYesNo(systemIntake.needsEaSupport)}
            />
          </div>
          <div>
            <DescriptionTerm term="Where are you in the process?" />
            <DescriptionDefinition definition={systemIntake.currentStage} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Do you currently have a contract in place?" />
            <DescriptionDefinition definition={systemIntake.hasContract} />
          </div>
          <div>
            <DescriptionTerm term="Does the project have funding" />
            <DescriptionDefinition definition={fundingDefinition()} />
          </div>
        </ReviewRow>
      </DescriptionList>
    </div>
  );
};
export default SystemIntakeReview;
