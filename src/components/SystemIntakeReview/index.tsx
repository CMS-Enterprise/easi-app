import React from 'react';
import { useTranslation } from 'react-i18next';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import contractStatus from 'constants/enums/contractStatus';
import { yesNoMap } from 'data/common';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { SystemIntakeStatus } from 'types/graphql-global-types';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { formatContractDate, formatDate } from 'utils/date';
import { FundingSourcesListItem } from 'views/SystemIntake/ContractDetails/FundingSources';

type SystemIntakeReviewProps = {
  systemIntake: SystemIntake;
};

type FundingSourcesObject = {
  [number: string]: {
    fundingNumber: string | null;
    sources: (string | null)[];
  };
};

export const SystemIntakeReview = ({
  systemIntake
}: SystemIntakeReviewProps) => {
  const { contract, status, submittedAt } = systemIntake;
  const { t } = useTranslation('intake');

  const fundingDefinition = () => {
    const { existingFunding, fundingSources } = systemIntake;

    // Format funding sources object
    const fundingSourcesObject = fundingSources.reduce<FundingSourcesObject>(
      (acc, { fundingNumber, source }) => {
        const sourcesArray = acc[fundingNumber!]
          ? [...acc[fundingNumber!].sources, source]
          : [source];
        // Return formatted object of funding sources
        return {
          ...acc,
          [fundingNumber!]: {
            fundingNumber,
            sources: sourcesArray
          }
        };
      },
      {}
    );

    // If no funding sources, return no
    if (!existingFunding) return 'N/A';

    return (
      <ul className="usa-list--unstyled">
        {Object.values(fundingSourcesObject).map(
          ({ fundingNumber, sources }) => {
            return (
              <FundingSourcesListItem
                key={fundingNumber}
                fundingNumber={fundingNumber!}
                sources={sources}
              />
            );
          }
        )}
      </ul>
    );
  };
  const issoDefinition = () => {
    const hasIsso = convertBoolToYesNo(systemIntake.isso.isPresent);
    if (systemIntake.isso.isPresent) {
      return `${hasIsso}, ${systemIntake.isso.name}`;
    }
    return hasIsso;
  };

  const getSubmissionDate = () => {
    if (status === SystemIntakeStatus.INTAKE_DRAFT) {
      return t('review.notSubmitted');
    }

    if (submittedAt) {
      return formatDate(submittedAt);
    }

    return 'N/A';
  };

  return (
    <div>
      <DescriptionList title={t('review.systemRequest')}>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.submissionDate')} />
            <DescriptionDefinition definition={getSubmissionDate()} />
          </div>
        </ReviewRow>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Contact Details</h2>

      <DescriptionList title={t('review.contactDetails')}>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('fields.requester')} />
            <DescriptionDefinition definition={systemIntake.requester.name} />
          </div>
          <div>
            <DescriptionTerm term={t('review.requesterComponent')} />
            <DescriptionDefinition
              definition={systemIntake.requester.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.cmsBusinessOwnerName')} />
            <DescriptionDefinition
              definition={systemIntake.businessOwner.name}
            />
          </div>
          <div>
            <DescriptionTerm term={t('review.cmsBusinessOwnerComponent')} />
            <DescriptionDefinition
              definition={systemIntake.businessOwner.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.cmsProjectManagerName')} />
            <DescriptionDefinition
              definition={systemIntake.productManager.name}
            />
          </div>
          <div>
            <DescriptionTerm term={t('review.cmsProjectManagerComponent')} />
            <DescriptionDefinition
              definition={systemIntake.productManager.component}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.isso')} />
            <DescriptionDefinition definition={issoDefinition()} />
          </div>
          <div>
            <DescriptionTerm term={t('review.collaborating')} />
            {systemIntake.governanceTeams.isPresent ? (
              (systemIntake.governanceTeams.teams || []).map(team => (
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
      <h2 className="font-heading-xl">{t('review.requestDetails')}</h2>

      <DescriptionList title={t('review.requestDetails')}>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.projectName')} />
            <DescriptionDefinition definition={systemIntake.requestName} />
          </div>
        </ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term={t('review.businessNeed')} />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.businessNeed}
            />
          </div>
        </div>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term={t('review.solving')} />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.businessSolution}
            />
          </div>
        </div>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.process')} />
            <DescriptionDefinition definition={systemIntake.currentStage} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.eaSupport')} />
            <DescriptionDefinition
              definition={convertBoolToYesNo(systemIntake.needsEaSupport)}
            />
          </div>
        </ReviewRow>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Contract Details</h2>

      <DescriptionList title={t('review.contractDetails')}>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('contractDetails.fundingSources.label')} />
            <DescriptionDefinition definition={fundingDefinition()} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.costs')} />
            <DescriptionDefinition
              definition={
                systemIntake.costs.isExpectingIncrease &&
                yesNoMap[systemIntake.costs.isExpectingIncrease]
              }
            />
          </div>
          {systemIntake.costs.isExpectingIncrease === 'YES' && (
            <div>
              <DescriptionTerm term={t('review.increase')} />
              <DescriptionDefinition
                definition={systemIntake.costs.expectedIncreaseAmount}
              />
            </div>
          )}
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.contract')} />
            <DescriptionDefinition
              definition={
                contractStatus[`${systemIntake.contract.hasContract}`]
              }
            />
          </div>
        </ReviewRow>
        {['HAVE_CONTRACT', 'IN_PROGRESS'].includes(
          systemIntake.contract.hasContract || ''
        ) && (
          <>
            <ReviewRow>
              <div>
                <DescriptionTerm term={t('review.contractors')} />
                <DescriptionDefinition definition={contract.contractor} />
              </div>
              {/*
                If the intake has a "contract number", render it, and only it
                If the intake has a "contract vehicle", render it and "Not Entered" for "contract number"
                  (since this intake was before we introduced contract numbers)
              */}
              {contract.number !== null ? (
                <div>
                  <DescriptionTerm term={t('review.contractNumber')} />
                  <DescriptionDefinition definition={contract.number} />
                </div>
              ) : (
                contract.vehicle !== null && (
                  <>
                    <div>
                      <DescriptionTerm term={t('review.contractVehicle')} />
                      <DescriptionDefinition definition={contract.vehicle} />
                    </div>
                    <div>
                      <DescriptionTerm term={t('review.contractNumber')} />
                      <DescriptionDefinition
                        definition={t('review.notEntered')}
                      />
                    </div>
                  </>
                )
              )}
            </ReviewRow>
            <ReviewRow>
              <div>
                <DescriptionTerm term={t('review.performance')} />
                <DescriptionDefinition
                  definition={`${formatContractDate(contract.startDate)} ${t(
                    'to'
                  )} ${formatContractDate(contract.endDate)}`}
                />
              </div>
            </ReviewRow>
          </>
        )}
      </DescriptionList>
    </div>
  );
};
export default SystemIntakeReview;
