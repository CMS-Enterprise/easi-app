import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import { RichTextViewer } from 'components/RichTextEditor';

type NotGovernanceProps = {
  intake: SystemIntakeFragmentFragment;
};

/**
 * Displays decision if request is not approved
 *
 * Used in requester view of Decision and Next Steps page
 */
const NotGovernance = ({ intake }: NotGovernanceProps) => {
  const { rejectionReason, decisionState } = intake;
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <>
      <h2 className="margin-top-0" data-testid="grt-rejected">
        {t('decision.description', { context: decisionState })}
      </h2>

      <h3 className="margin-bottom-1">{t('taskList:decision.reasons')}</h3>
      <RichTextViewer
        value={rejectionReason || t('decision.noRejectionReasons')}
        className="margin-bottom-2"
      />
    </>
  );
};

export default NotGovernance;
