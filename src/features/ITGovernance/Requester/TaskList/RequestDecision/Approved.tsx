import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { RichTextViewer } from 'components/RichTextEditor';
import { formatDateUtc } from 'utils/date';

type ApprovedProps = {
  intake: SystemIntakeFragmentFragment;
};

/**
 * Displays LCID summary and next steps if a request has been approved
 *
 * Used in requester view of Decision and Next Steps page
 */
const Approved = ({ intake }: ApprovedProps) => {
  const { lcid, lcidScope, lcidExpiresAt, decisionNextSteps } = intake;
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
            <RichTextViewer
              value={
                lcidScope || t('governanceReviewTeam:notes.extendLcid.noScope')
              }
            />
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

      {/* Next steps */}
      <h3 className="margin-bottom-1">{t('decision.nextSteps')}</h3>

      {decisionNextSteps && (
        <Alert type="info" slim className="margin-y-2">
          {t('decision.completeNextSteps')}
        </Alert>
      )}

      <RichTextViewer
        value={
          decisionNextSteps ||
          t('governanceReviewTeam:notes.extendLcid.noNextSteps')
        }
      />
    </>
  );
};

export default Approved;
