import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

type DecisionProps = {
  systemIntake?: SystemIntake | null;
};

const Decision = ({ systemIntake }: DecisionProps) => {
  const { t } = useTranslation();

  const Approved = () => (
    <>
      <PageHeading>
        {t('governanceReviewTeam:decision.titleApproved')}
      </PageHeading>
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
                  ? DateTime.fromISO(
                      systemIntake?.lcidExpiresAt
                    ).toLocaleString(DateTime.DATE_FULL)
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
      </DescriptionList>
    </>
  );

  const Rejected = () => (
    <>
      <PageHeading>
        {t('governanceReviewTeam:decision.titleRejected')}
      </PageHeading>
      <DescriptionList
        title={t('governanceReviewTeam:decision.decisionSectionTitle')}
      >
        <ReviewRow>
          <div>
            <DescriptionTerm
              term={t('governanceReviewTeam:decision.rejectionReason')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake?.rejectionReason}
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
      </DescriptionList>
    </>
  );

  const NotItRequest = () => (
    <>
      <PageHeading>
        {t('governanceReviewTeam:decision.titleClosed')}
      </PageHeading>
      <p>{t('governanceReviewTeam:decision.descriptionNotItRequest')}</p>
    </>
  );

  const NoGovernance = () => (
    <>
      <PageHeading>
        {t('governanceReviewTeam:decision.titleClosed')}
      </PageHeading>
      <p>{t('governanceReviewTeam:decision.descriptionNoGovernance')}</p>
    </>
  );

  const ShutdownComplete = () => (
    <>
      <PageHeading>
        {t('governanceReviewTeam:decision.titleClosed')}
      </PageHeading>
      <p>{t('governanceReviewTeam:decision.shutdownComplete')}</p>
    </>
  );

  switch (systemIntake?.status) {
    case 'LCID_ISSUED':
      return <Approved />;
    case 'NOT_APPROVED':
      return <Rejected />;
    case 'NOT_IT_REQUEST':
      return <NotItRequest />;
    case 'NO_GOVERNANCE':
      return <NoGovernance />;
    case 'SHUTDOWN_COMPLETE':
      return <ShutdownComplete />;
    default:
  }

  return (
    <>
      <PageHeading>{t('governanceReviewTeam:decision.title')}</PageHeading>
      <p>{t('governanceReviewTeam:decision.noDecision')}</p>
    </>
  );
};

export default Decision;
