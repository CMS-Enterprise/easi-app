import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { formatDateUtc } from 'utils/date';

type ApprovedProps = {
  intake: SystemIntake;
};

const Approved = ({ intake }: ApprovedProps) => {
  const { id, lcid, lcidScope, lcidExpiresAt, decisionNextSteps } = intake;
  const { t } = useTranslation('taskList');
  return (
    <>
      <div
        className="easi-governance-decision__info"
        data-testid="grt-approved"
      >
        <h2 className="margin-top-0">{t('decision.bizCaseApproved')}</h2>
        <dl>
          <dt>{t('decision.lcid')}</dt>
          <dd className="margin-left-0 font-body-xl text-bold">{lcid}</dd>
        </dl>
        <h3>{t('decision.lcidScope')}</h3>
        <p className="text-pre-wrap">{lcidScope}</p>
        {lcidExpiresAt && (
          <p className="text-bold">
            {t('decision.lcidExpiration', {
              date: formatDateUtc(lcidExpiresAt, 'MMMM d, yyyy')
            })}
          </p>
        )}
        {intake?.lcidCostBaseline && (
          <>
            <h3 className="margin-top-0">{t('decision.costBaseline')}</h3>
            <p>{intake.lcidCostBaseline}</p>
          </>
        )}
      </div>

      {decisionNextSteps && (
        <>
          <h3>{t('decision.nextSteps')}</h3>
          <Alert type="info">{t('decision.completeNextSteps')}</Alert>

          <p className="text-pre-wrap">{decisionNextSteps}</p>
        </>
      )}

      <div className="margin-top-4">
        <UswdsReactLink
          className="usa-button margin-bottom-2"
          variant="unstyled"
          to={`/governance-task-list/${id}`}
        >
          {t('navigation.returnToTaskList')}
        </UswdsReactLink>
      </div>
    </>
  );
};

export default Approved;
