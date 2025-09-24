import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { SystemIntakeDecisionState } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
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
      <PageHeading className="margin-y-0">{t('decision.heading')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05">
        {t('decision.subheading')}
      </p>

      {decisionState === SystemIntakeDecisionState.NO_DECISION && (
        <>
          <UswdsReactLink
            to="resolutions"
            className="usa-button margin-bottom-5"
            variant="unstyled"
          >
            {t('decision.issueDecisionButton')}
          </UswdsReactLink>

          <Alert type="info" slim>
            <Trans
              i18nKey="governanceReviewTeam:decision.noDecisionAlert"
              components={{
                link1: <UswdsReactLink to="actions"> </UswdsReactLink>
              }}
            />
          </Alert>
        </>
      )}
    </>
  );
};

export default Decision;
