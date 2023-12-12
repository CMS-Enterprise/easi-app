import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { RichTextViewer } from 'components/RichTextEditor';
import Alert from 'components/shared/Alert';
import { SystemIntake } from 'queries/types/SystemIntake';
import { formatDateUtc } from 'utils/date';

type ApprovedProps = {
  intake: SystemIntake;
};

/**
 * Displays LCID summary and next steps if a request has been approved
 *
 * Used in requester view of Decision and Next Steps page
 */
const Approved = ({ intake }: ApprovedProps) => {
  const { id, lcid, lcidScope, lcidExpiresAt, decisionNextSteps } = intake;
  const { t } = useTranslation('taskList');

  return (
    <>
      {/* LCID summary info box */}
      <div
        className="easi-governance-decision__info padding-2"
        data-testid="grt-approved"
      >
        <h2 className="margin-top-05 margin-bottom-1">
          {t('decision.bizCaseApproved')}
        </h2>

        <dl>
          <dt>{t('decision.lcid')}</dt>
          <dd className="margin-left-0 font-body-xl text-bold">{lcid}</dd>

          <dt>
            <h3 className="margin-top-1 margin-bottom-05">
              {t('decision.lcidScope')}
            </h3>
          </dt>
          <dd className="margin-left-0 color-white">
            {lcidScope && <RichTextViewer value={lcidScope} />}
          </dd>

          {lcidExpiresAt && (
            <dd className="margin-left-0 margin-y-2 text-bold">
              {t('decision.lcidExpiration', {
                date: formatDateUtc(lcidExpiresAt, 'MMMM d, yyyy')
              })}
            </dd>
          )}

          {intake?.lcidCostBaseline && (
            <>
              <dt>
                <h3 className="margin-top-1 margin-bottom-05">
                  {t('decision.costBaseline')}
                </h3>
              </dt>
              <dd className="margin-left-0 color-white">
                {intake.lcidCostBaseline}
              </dd>
            </>
          )}
        </dl>
      </div>

      {decisionNextSteps && (
        <>
          <h3>{t('decision.nextSteps')}</h3>
          <Alert type="info" slim>
            {t('decision.completeNextSteps')}
          </Alert>
          <RichTextViewer value={decisionNextSteps} className="margin-y-2" />
        </>
      )}

      <UswdsReactLink
        className="usa-button margin-y-2"
        variant="unstyled"
        to={`/governance-task-list/${id}`}
      >
        {t('navigation.returnToTaskList')}
      </UswdsReactLink>
    </>
  );
};

export default Approved;
