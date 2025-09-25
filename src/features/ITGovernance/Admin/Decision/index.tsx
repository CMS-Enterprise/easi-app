import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  // GetSystemIntakeQuery,
  SystemIntakeDecisionState
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
// import { RichTextViewer } from 'components/RichTextEditor';
import Tag from 'components/Tag';
import { formatDateLocal } from 'utils/date';

// type RejectedProps = {
//   rejectionReason?: string | null;
//   decisionNextSteps?: string | null;
// };

// const Rejected = ({ rejectionReason, decisionNextSteps }: RejectedProps) => {
//   const { t } = useTranslation('governanceReviewTeam');

//   return (
//     <DescriptionList title={t('decision.decisionSectionTitle')}>
//       <DescriptionTerm term={t('decision.rejectionReason')} />
//       <DescriptionDefinition
//         className="text-pre-wrap"
//         definition={
//           <RichTextViewer
//             value={rejectionReason || t('decision.noRejectionReasons')}
//           />
//         }
//       />

//       <DescriptionTerm term={t('decision.nextSteps')} />
//       <DescriptionDefinition
//         className="text-pre-wrap"
//         definition={
//           <RichTextViewer
//             value={decisionNextSteps || t('notes.extendLcid.noNextSteps')}
//           />
//         }
//       />
//     </DescriptionList>
//   );
// };

const DefinitionCombo = ({
  term,
  definition,
  isLast
}: {
  term: string;
  definition: string;
  isLast?: boolean;
}) => {
  return (
    <>
      <DescriptionTerm term={term} className="margin-bottom-0" />
      <DescriptionDefinition
        className={`text-pre-wrap ${isLast ? 'margin-bottom-0' : 'margin-bottom-2'}`}
        definition={definition}
      />
    </>
  );
};

const LcidInfoContainer = ({
  decisionState,
  rejectionReason,
  lcid,
  lcidIssuedAt,
  lcidExpiresAt,
  lcidScope,
  lcidCostBaseline
  // }: {
  //   decisionState: SystemIntakeDecisionState;
  //   rejectionReason?: string | null;
  //   lcid?: string | null;
  //   lcidIssuedAt?: string | null;
  //   lcidExpiresAt?: string | null;
  //   lcidScope?: string | null;
  //   lcidCostBaseline?: string | null;
}: DecisionProps) => {
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
          {decisionState === SystemIntakeDecisionState.LCID_ISSUED ? (
            <>
              <div className="display-flex margin-bottom-2 flex-justify">
                <h3 className="margin-y-0">{t('decision.lcidInfoHeader')}</h3>
                <Tag className="bg-success-dark text-white">TODO Gary</Tag>
              </div>
              <DefinitionCombo
                term={t('decision.terms.lcidNumber')}
                definition={lcid!}
              />
              <div className="grid-row">
                <Grid tablet={{ col: 6 }}>
                  <DefinitionCombo
                    term={t('decision.terms.issueDate')}
                    definition={formatDateLocal(lcidIssuedAt!, 'MM/dd/yyyy')}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DefinitionCombo
                    term={t('decision.terms.expirationDate')}
                    definition={formatDateLocal(lcidExpiresAt!, 'MM/dd/yyyy')}
                  />
                </Grid>
              </div>
              <DefinitionCombo
                term={t('decision.terms.scope')}
                definition={lcidScope ?? t('notes.extendLcid.noScope')}
              />
              <DefinitionCombo
                isLast
                term={t('decision.terms.projectCostBaseline')}
                definition={
                  lcidCostBaseline ?? t('notes.extendLcid.noCostBaseline')
                }
              />
            </>
          ) : (
            <>
              <DefinitionCombo
                term={t('decision.decisionDate')}
                definition="TODO Date Format"
              />
              <DefinitionCombo
                isLast
                term={t('decision.reason')}
                definition={rejectionReason || t('decision.noRejectionReasons')}
              />
            </>
          )}
        </dl>
      </div>
    </>
  );
};

type DecisionProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  decisionState: SystemIntakeDecisionState;
  lcid?: string | null;
  lcidIssuedAt?: string | null;
  lcidExpiresAt?: string | null;
  lcidScope?: string | null;
  lcidCostBaseline?: string | null;
};

const Decision = ({
  rejectionReason,
  decisionNextSteps,
  decisionState,
  lcid,
  lcidIssuedAt,
  lcidExpiresAt,
  lcidScope,
  lcidCostBaseline
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
          lcid={lcid}
          lcidIssuedAt={lcidIssuedAt}
          lcidExpiresAt={lcidExpiresAt}
          lcidScope={lcidScope}
          lcidCostBaseline={lcidCostBaseline}
        />
      )}
    </>
  );
};

export default Decision;
