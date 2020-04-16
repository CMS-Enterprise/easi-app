import { DateTime } from 'luxon';
import React from 'react';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from '../shared/DescriptionGroup';
import convertBoolToYesNo from '../../utils/convertBoolToYesNo';
import { SystemIntakeForm } from '../../types/systemIntake';

type SystemIntakeReview = {
  heading: string;
  systemIntake: SystemIntakeForm;
  id?: string;
};

export const SystemIntakeReview = ({
  heading,
  systemIntake,
  id
}: SystemIntakeReview) => {
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
    <div className="system-intake__review margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">{heading}</h1>
      {!systemIntake && id && (
        <h2 className="font-heading-xl">
          System intake with ID: {id} was not found
        </h2>
      )}
      {systemIntake && (
        <div>
          <DescriptionList title="System Request">
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Submission Date" />
                {/* TO DO Make this changeable */}
                <DescriptionDefinition
                  definition={DateTime.local().toLocaleString(
                    DateTime.DATE_MED
                  )}
                />
              </div>
              <div>
                <DescriptionTerm term="Request for" />
                <DescriptionDefinition definition={systemIntake.currentStage} />
              </div>
            </div>
          </DescriptionList>

          <hr className="system-intake__hr" />
          <h2 className="font-heading-xl">Contact Details</h2>

          <DescriptionList title="Contact Details">
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Requester" />
                <DescriptionDefinition
                  definition={systemIntake.requester.name}
                />
              </div>
              <div>
                <DescriptionTerm term="Requester Component" />
                <DescriptionDefinition
                  definition={systemIntake.requester.component}
                />
              </div>
            </div>
            <div className="system-intake__review-row">
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
            </div>
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="CMS Project/Product Manager or lead" />
                <DescriptionDefinition
                  definition={systemIntake.productManager.name}
                />
              </div>
              <div>
                <DescriptionTerm term="Product Manager Component" />
                <DescriptionDefinition
                  definition={systemIntake.productManager.component}
                />
              </div>
            </div>
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Does your project have an Information System Security Officer (ISSO)?" />
                <DescriptionDefinition definition={issoDefinition()} />
              </div>
              <div>
                <DescriptionTerm term="Currently collaborating with" />
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
            </div>
          </DescriptionList>

          <hr className="system-intake__hr" />
          <h2 className="font-heading-xl">Request Details</h2>

          <DescriptionList title="Request Details">
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Project Name" />
                <DescriptionDefinition definition={systemIntake.projectName} />
              </div>
              <div>
                <DescriptionTerm term="Does the project have funding" />
                <DescriptionDefinition definition={fundingDefinition()} />
              </div>
            </div>
            <div className="margin-bottom-205 line-height-body-3">
              <div>
                <DescriptionTerm term="What is your business need?" />
                <DescriptionDefinition definition={systemIntake.businessNeed} />
              </div>
            </div>
            <div className="margin-bottom-205 line-height-body-3">
              <div>
                <DescriptionTerm term="How are you thinking of solving it?" />
                <DescriptionDefinition
                  definition={systemIntake.businessSolution}
                />
              </div>
            </div>
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Where are you in the process?" />
                <DescriptionDefinition definition={systemIntake.currentStage} />
              </div>
              <div>
                <DescriptionTerm term="Do you currently have a contract in place?" />
                <DescriptionDefinition definition={systemIntake.hasContract} />
              </div>
            </div>
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Do you need Enterprise Architecture (EA) support?" />
                <DescriptionDefinition
                  definition={convertBoolToYesNo(systemIntake.needsEaSupport)}
                />
              </div>
            </div>
          </DescriptionList>
        </div>
      )}
    </div>
  );
};
export default SystemIntakeReview;
