import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
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

const LcidInfoContainer = ({
  decisionState
}: {
  decisionState: SystemIntakeDecisionState;
}) => {
  const { t } = useTranslation('governanceReviewTeam');

  const IconComponent =
    decisionState === SystemIntakeDecisionState.LCID_ISSUED
      ? Icon.CheckCircle
      : Icon.Cancel;

  const decisionStateBackgroundColorMap: Record<
    SystemIntakeDecisionState,
    string
  > = {
    [SystemIntakeDecisionState.LCID_ISSUED]: 'bg-success-dark',
    [SystemIntakeDecisionState.NOT_APPROVED]: 'bg-error-dark',
    [SystemIntakeDecisionState.NOT_GOVERNANCE]: 'bg-base-dark',
    [SystemIntakeDecisionState.NO_DECISION]: ''
  };

  return (
    <>
      <div
        className={`margin-top-5 padding-2 display-flex flex-align-center ${decisionStateBackgroundColorMap[decisionState]}`}
      >
        <IconComponent
          className="text-white margin-right-2"
          aria-hidden
          size={3}
        />
        <span className="easi-body-large text-white">
          {t('decision.decisionState', { context: decisionState })}
        </span>
      </div>
      <div className="bg-base-lightest padding-3">
        <dl className="easi-dl">
          <DescriptionTerm
            term={t('decision.decisionDate')}
            className="margin-bottom-0"
          />
          <DescriptionDefinition
            className="text-pre-wrap margin-bottom-2"
            // TODO: date format here
            definition={
              <RichTextViewer
                // value={rejectionReason || t('decision.noRejectionReasons')}
                value="TODO Date Format"
              />
            }
          />

          <DescriptionTerm
            term={t('decision.reason')}
            className="margin-bottom-0"
          />
          <DescriptionDefinition
            className="text-pre-wrap margin-bottom-2"
            // TODO: date format here
            definition={<RichTextViewer value="TODO later" />}
          />
        </dl>
      </div>
    </>
  );
};

type DecisionProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  decisionState: SystemIntakeDecisionState;
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

      {decisionState === SystemIntakeDecisionState.NO_DECISION ? (
        <>
          <UswdsReactLink
            to="resolutions"
            className="usa-button margin-bottom-3"
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
      ) : (
        // decisionState === all else
        <LcidInfoContainer
          decisionState={decisionState}
          rejectionReason={rejectionReason}
        />
      )}
    </>
  );
};

export default Decision;
