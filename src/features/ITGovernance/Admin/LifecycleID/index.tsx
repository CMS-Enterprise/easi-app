import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import { RichTextViewer } from 'components/RichTextEditor';
import { formatDateUtc } from 'utils/date';

type LcidProps = {
  systemIntake?: SystemIntakeFragmentFragment | null;
};

const LifecycleID = ({ systemIntake }: LcidProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  const Issued = () => (
    <>
      <PageHeading className="margin-top-0">
        {t('lifecycleID.title')}
      </PageHeading>
      <DescriptionList title={t('decision.decisionSectionTitle')}>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('lifecycleID.title')} />
            <DescriptionDefinition definition={systemIntake?.lcid} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('lifecycleID.expiration')} />
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
            <DescriptionTerm term={t('lifecycleID.scope')} />
            <DescriptionDefinition
              definition={
                <RichTextViewer
                  value={
                    systemIntake?.lcidScope || t('notes.extendLcid.noScope')
                  }
                />
              }
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('lifecycleID.nextSteps')} />
            <DescriptionDefinition
              definition={
                <RichTextViewer
                  value={
                    systemIntake?.decisionNextSteps ||
                    t('notes.extendLcid.noNextSteps')
                  }
                />
              }
            />
          </div>
        </ReviewRow>
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
        {systemIntake?.lcidCostBaseline && (
          <ReviewRow>
            <div>
              <DescriptionTerm term={t('lifecycleID.costBaseline')} />
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
        {t('lifecycleID.title')}
      </PageHeading>
      <p>{t('lifecycleID.noLCID')}</p>
    </>
  );
};

export default LifecycleID;
