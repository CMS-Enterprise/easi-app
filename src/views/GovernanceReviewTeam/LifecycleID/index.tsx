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
      <PageHeading>{t('governanceReviewTeam:decision.lcid')}</PageHeading>
      <DescriptionList
        title={t('governanceReviewTeam:decision.decisionSectionTitle')}
      >
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('governanceReviewTeam:decision.lcid')} />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake?.lcid}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:decision.lcidExpiration')}
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
            <DescriptionTerm term={t('governanceReviewTeam:decision.scope')} />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake?.lcidScope}
            />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:decision.nextSteps')}
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
                term={t('governanceReviewTeam:decision.costBaseline')}
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

  // NJD - TODO: flesh this out
  return (
    <>
      <div>No LCID</div>
    </>
  );
};

export default LifecycleID;
