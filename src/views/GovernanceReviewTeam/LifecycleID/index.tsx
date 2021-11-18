import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { formatDateAndIgnoreTimezone } from 'utils/date';

type LcidProps = {
  systemIntake?: SystemIntake | null;
};

const LifecycleID = ({ systemIntake }: LcidProps) => {
  const { t } = useTranslation();

  const Issued = () => (
    <>
      <PageHeading>{t('governanceReviewTeam:lifecycleID.title')}</PageHeading>
      <DescriptionList
        title={t('governanceReviewTeam:decision.decisionSectionTitle')}
      >
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.title')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake?.lcid}
            />
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
                  ? formatDateAndIgnoreTimezone(systemIntake?.lcidExpiresAt)
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
              className="text-pre-wrap"
              definition={systemIntake?.lcidScope}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:lifecycleID.nextSteps')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake?.decisionNextSteps}
            />
          </div>
        </ReviewRow>
        {systemIntake?.lcidCostBaseline && (
          <ReviewRow>
            <div>
              <DescriptionTerm
                term={t('governanceReviewTeam:lifecycleID.costBaseline')}
              />
              <DescriptionDefinition
                className="text-pre-wrap"
                definition={systemIntake?.lcidCostBaseline}
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
