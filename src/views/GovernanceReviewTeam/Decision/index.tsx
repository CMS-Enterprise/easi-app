import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { SystemIntakeForm } from 'types/systemIntake';

type DecisionProps = {
  systemIntake: SystemIntakeForm;
};

const Decision = ({ systemIntake }: DecisionProps) => {
  const { t } = useTranslation();

  const Approved = () => (
    <>
      <h1>{t('governanceReviewTeam:decision.titleApproved')}</h1>
      <DescriptionList
        title={t('governanceReviewTeam:decision.decisionSectionTitle')}
      >
        <ReviewRow>
          <div>
            <DescriptionTerm term={t('governanceReviewTeam:decision.lcid')} />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={systemIntake.lcid}
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
                systemIntake.lcidExpiration
                  ? systemIntake.lcidExpiration.toLocaleString(
                      DateTime.DATE_FULL
                    )
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
              definition={systemIntake.lcidScope}
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
              definition={systemIntake.decisionNextSteps}
            />
          </div>
        </ReviewRow>
      </DescriptionList>
    </>
  );

  const Rejected = () => (
    <>
      <h1>{t('governanceReviewTeam:decision.titleRejected')}</h1>
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
              definition={systemIntake.rejectionReason}
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
              definition={systemIntake.decisionNextSteps}
            />
          </div>
        </ReviewRow>
      </DescriptionList>
    </>
  );

  const NotItRequest = () => (
    <>
      <h1>{t('governanceReviewTeam:decision.titleClosed')}</h1>
      <p>{t('governanceReviewTeam:decision.descriptionNotItRequest')}</p>
    </>
  );

  const NoGovernance = () => (
    <>
      <h1>{t('governanceReviewTeam:decision.titleClosed')}</h1>
      <p>{t('governanceReviewTeam:decision.descriptionNoGovernance')}</p>
    </>
  );

  const ShutdownComplete = () => (
    <>
      <h1>{t('governanceReviewTeam:decision.titleClosed')}</h1>
      <p>{t('governanceReviewTeam:decision.shutdownComplete')}</p>
    </>
  );

  if (systemIntake.status === 'LCID_ISSUED') {
    return <Approved />;
  }

  if (systemIntake.status === 'NOT_APPROVED') {
    return <Rejected />;
  }

  if (systemIntake.status === 'NOT_IT_REQUEST') {
    return <NotItRequest />;
  }

  if (systemIntake.status === 'NO_GOVERNANCE') {
    return <NoGovernance />;
  }
  if (systemIntake.status === 'SHUTDOWN_COMPLETE') {
    return <ShutdownComplete />;
  }

  return (
    <>
      <h1>{t('governanceReviewTeam:decision.title')}</h1>
      <p>{t('governanceReviewTeam:decision.noDecision')}</p>
    </>
  );
};

export default Decision;
