import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeDecisionState } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import PageHeading from 'components/PageHeading';
import { RichTextViewer } from 'components/RichTextEditor';

type RejectedProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
};

const Rejected = ({ rejectionReason, decisionNextSteps }: RejectedProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <DescriptionList title={t('decision.decisionSectionTitle')}>
      <DescriptionTerm term={t('decision.rejectionReason')} />
      <DescriptionDefinition
        className="text-pre-wrap"
        definition={
          <RichTextViewer
            value={rejectionReason || t('decision.noRejectionReasons')}
          />
        }
      />

      <DescriptionTerm term={t('decision.nextSteps')} />
      <DescriptionDefinition
        className="text-pre-wrap"
        definition={
          <RichTextViewer
            value={decisionNextSteps || t('notes.extendLcid.noNextSteps')}
          />
        }
      />
    </DescriptionList>
  );
};

type DecisionProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  decisionState?: SystemIntakeDecisionState;
};

const Decision = ({
  rejectionReason,
  decisionNextSteps,
  decisionState
}: DecisionProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <>
      <PageHeading data-testid="grt-decision-view" className="margin-top-0">
        {t('decision.title', { context: decisionState })}
      </PageHeading>

      {decisionState === SystemIntakeDecisionState.NOT_APPROVED ? (
        <Rejected
          rejectionReason={rejectionReason}
          decisionNextSteps={decisionNextSteps}
        />
      ) : (
        <p>{t('decision.description', { context: decisionState })}</p>
      )}
    </>
  );
};

export default Decision;
