import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntake } from 'gql/legacyGQL/types/SystemIntake';

import { RichTextViewer } from 'components/RichTextEditor';

type RejectedProps = {
  intake: SystemIntake;
};

/**
 * Displays decision if request is not approved
 *
 * Used in requester view of Decision and Next Steps page
 */
const Rejected = ({ intake }: RejectedProps) => {
  const { rejectionReason, decisionNextSteps } = intake;
  const { t } = useTranslation('taskList');

  return (
    <>
      <h2 className="margin-top-0" data-testid="grt-rejected">
        {t('decision.bizCaseRejected')}
      </h2>

      <h3 className="margin-bottom-1">{t('decision.reasons')}</h3>
      <RichTextViewer
        value={
          rejectionReason ||
          t('governanceReviewTeam:decision.noRejectionReasons')
        }
        className="margin-bottom-2"
      />

      <h3 className="margin-bottom-1">{t('decision.nextSteps')}</h3>
      <RichTextViewer
        value={
          decisionNextSteps ||
          t('governanceReviewTeam:notes.extendLcid.noNextSteps')
        }
        className="margin-bottom-2"
      />
    </>
  );
};

export default Rejected;
