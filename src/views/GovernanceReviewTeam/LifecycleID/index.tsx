import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import { RichTextViewer } from 'components/RichTextEditor';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { SystemIntake } from 'queries/types/SystemIntake';
import { formatDateUtc } from 'utils/date';

type LcidProps = {
  systemIntake?: SystemIntake | null;
};

const LifecycleID = ({ systemIntake }: LcidProps) => {
  const { t } = useTranslation();
  const flags = useFlags();

  const Issued = () => (
    <>
      <PageHeading className="margin-top-0">
        {t('governanceReviewTeam:lifecycleID.title')}
      </PageHeading>
      <DescriptionList
        title={t('governanceReviewTeam:decision.decisionSectionTitle')}
      >
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.title')}
            />
            <DescriptionDefinition definition={systemIntake?.lcid} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.expiration')}
            />
            <DescriptionDefinition
              definition={
                systemIntake?.lcidExpiresAt
                  ? formatDateUtc(systemIntake?.lcidExpiresAt, 'MMMM d, yyyy')
                  : ''
              }
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.scope')}
            />
            <DescriptionDefinition
              definition={
                <RichTextViewer value={systemIntake?.lcidScope || ''} />
              }
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.nextSteps')}
            />
            <DescriptionDefinition
              definition={
                <RichTextViewer value={systemIntake?.decisionNextSteps || ''} />
              }
            />
          </div>
        </ReviewRow>
        {flags.itGovV2Enabled && (
          <ReviewRow>
            <div>
              <DescriptionTerm term={t('action:issueLCID.trbFollowup.label')} />
              <DescriptionDefinition
                definition={
                  systemIntake?.trbFollowUpRecommendation &&
                  t(
                    `action:issueLCID.trbFollowup.${systemIntake.trbFollowUpRecommendation}`
                  )
                }
              />
            </div>
          </ReviewRow>
        )}
        {systemIntake?.lcidCostBaseline && (
          <ReviewRow>
            <div>
              <DescriptionTerm
                term={t('governanceReviewTeam:lifecycleID.costBaseline')}
              />
              <DescriptionDefinition
                definition={
                  <RichTextViewer value={systemIntake?.lcidCostBaseline} />
                }
              />
            </div>
          </ReviewRow>
        )}
      </DescriptionList>
    </>
  );

  // If intake has ever had LCID issued, display the information
  if (systemIntake?.lcid != null) {
    return <Issued />;
  }

  // If intake doesn't have LCID, display notice
  return (
    <>
      <PageHeading data-testid="grt-decision-view">
        {t('governanceReviewTeam:lifecycleID.title')}
      </PageHeading>
      <p>{t('governanceReviewTeam:lifecycleID.noLCID')}</p>
    </>
  );
};

export default LifecycleID;
