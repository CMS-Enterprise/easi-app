import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { RichTextViewer } from 'components/RichTextEditor';
import { SystemIntake } from 'queries/types/SystemIntake';

type RejectedProps = {
  intake: SystemIntake;
};

const Rejected = ({ intake }: RejectedProps) => {
  const { id, rejectionReason, decisionNextSteps } = intake;
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

export default Rejected;
