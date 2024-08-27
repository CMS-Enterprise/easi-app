import React from 'react';
import { useTranslation } from 'react-i18next';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { yesNoMap } from 'data/common';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { SystemIntake } from 'queries/types/SystemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { formatContractDate, formatDateLocal } from 'utils/date';
import formatContractNumbers from 'utils/formatContractNumbers';
import DocumentsTable from 'views/SystemIntake/Documents/DocumentsTable';

import './index.scss';

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
  const {
    annualSpending,
    costs,
    contract,
    submittedAt,
    contractNumbers
  } = systemIntake;
  const {
    contacts: {
      data: { requester, businessOwner, productManager, isso }
    }
  } = useSystemIntakeContacts(systemIntake.id);
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
              <li
                key={fundingNumber}
                className="margin-top-205"
                id={`fundingSource${fundingNumber}`}
              >
                <p className="text-bold font-body-sm margin-bottom-0">
                  {t('contractDetails.fundingSources.fundingSource')}
                </p>
                <p className="margin-y-05">
                  {t('contractDetails.fundingSources.fundingNumberLabel', {
                    fundingNumber
                  })}
                </p>
                <p className="margin-y-05">
                  {t('contractDetails.fundingSources.fundingSourcesLabel', {
                    sources: sources.join(', ')
                  })}
                </p>
              </li>
            );
          }
        )}
      </ul>
    );
  };
  const issoDefinition = () => {
    const hasIsso = convertBoolToYesNo(!!isso.commonName);
    if (isso.commonName) {
      return `${hasIsso}, ${isso.commonName}`;
    }
    return hasIsso;
  };

  const getSubmissionDate = () => {
    if (submittedAt) {
      return formatDateLocal(submittedAt, 'MMMM d, yyyy');
    }
    return t('review.notSubmitted');
  };

  /* Conditionally render cost and annual spending information depending on what info is present.
      Original: Display only "costs" info
      Intermediate: Display annual spending info
      Current: Display annual spending and IT portion info
  */
  const formatCostAndSpendingInfo = () => {
    // If IT portion field is present, display annual spending and IT portion info
    if (annualSpending?.currentAnnualSpendingITPortion) {
      return (
        <>
          <ReviewRow>
            <div>
              <DescriptionTerm term={t('review.currentAnnualSpending')} />
              <DescriptionDefinition
                definition={annualSpending.currentAnnualSpending}
              />
            </div>
            <div>
              <DescriptionTerm
                term={t('review.currentAnnualSpendingITPortion')}
              />
              <DescriptionDefinition
                definition={annualSpending.currentAnnualSpendingITPortion}
              />
            </div>
          </ReviewRow>
          <ReviewRow>
            <div>
              <DescriptionTerm term={t('review.plannedYearOneSpending')} />
              <DescriptionDefinition
                definition={annualSpending.plannedYearOneSpending}
              />
            </div>
            <div>
              <DescriptionTerm
                term={t('review.plannedYearOneSpendingITPortion')}
              />
              <DescriptionDefinition
                definition={annualSpending.plannedYearOneSpendingITPortion}
              />
            </div>
          </ReviewRow>
        </>
      );
    }

    // If IT portion field is NOT present but annual spending is - display only annual spending info
    if (annualSpending?.currentAnnualSpending) {
      return (
        <>
          <ReviewRow>
            <div>
              <DescriptionTerm term={t('review.currentAnnualSpending')} />
              <DescriptionDefinition
                definition={annualSpending.currentAnnualSpending}
              />
            </div>
            <div>
              <DescriptionTerm term={t('review.plannedYearOneSpending')} />
              <DescriptionDefinition
                definition={annualSpending.plannedYearOneSpending}
              />
            </div>
          </ReviewRow>
        </>
      );
    }

    // If IT portion AND annual spending fields are not present - it is an old intake so display legacy cost info
    // TODO: add logic for checking that costs isnt empty here to be safe? diplay error message?
    return (
      <>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.costs')} />
            <DescriptionDefinition
              definition={
                systemIntake.costs?.isExpectingIncrease &&
                yesNoMap[systemIntake.costs.isExpectingIncrease]
              }
            />
          </div>
          {costs?.isExpectingIncrease === 'YES' && (
            <div>
              <DescriptionTerm term={t('review.increase')} />
              <DescriptionDefinition
                definition={costs.expectedIncreaseAmount}
              />
            </div>
          )}
        </ReviewRow>
      </>
    );
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
          <div data-testid={`contact-requester-${requester.id}`}>
            <DescriptionTerm term={t('fields.requester')} />
            <DescriptionDefinition definition={requester.commonName} />
          </div>
          <div>
            <DescriptionTerm term={t('review.requesterComponent')} />
            <DescriptionDefinition definition={requester.component} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.cmsBusinessOwnerName')} />
            <DescriptionDefinition definition={businessOwner.commonName} />
          </div>
          <div>
            <DescriptionTerm term={t('review.cmsBusinessOwnerComponent')} />
            <DescriptionDefinition definition={businessOwner.component} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.cmsProjectManagerName')} />
            <DescriptionDefinition definition={productManager.commonName} />
          </div>
          <div>
            <DescriptionTerm term={t('review.cmsProjectManagerComponent')} />
            <DescriptionDefinition definition={productManager.component} />
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
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.hasUiChanges')} />
            <DescriptionDefinition
              definition={convertBoolToYesNo(systemIntake.hasUiChanges)}
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
        {/* Conditionally render annual spending (current) or cost (legacy) questions and answers */}
        {formatCostAndSpendingInfo()}
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('review.contract')} />
            <DescriptionDefinition
              definition={t('intake:contractDetails.hasContract', {
                context: systemIntake.contract.hasContract
              })}
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
              {contractNumbers && contractNumbers.length > 0 ? (
                <div>
                  <DescriptionTerm term={t('review.contractNumber')} />
                  <DescriptionDefinition
                    definition={formatContractNumbers(contractNumbers)}
                  />
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

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">{t('review.documents')}</h2>
      <DocumentsTable
        systemIntakeId={systemIntake.id}
        documents={systemIntake.documents}
      />
    </div>
  );
};
export default SystemIntakeReview;
