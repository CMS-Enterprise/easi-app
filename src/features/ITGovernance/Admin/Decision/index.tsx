import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  SystemIntakeDecisionState,
  SystemIntakeLCIDStatus,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import LcidStatusTag from 'components/LcidStatusTag';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { RichTextViewer } from 'components/RichTextEditor';
import Tag from 'components/Tag';
import { formatDateLocal } from 'utils/date';

// minimal context to avoid drilling
const DecisionContext = React.createContext<DecisionProps | null>(null);
const useDecision = () => {
  const ctx = React.useContext(DecisionContext);
  if (!ctx) throw new Error('useDecision must be used within DecisionContext');
  return ctx;
};

const DefinitionCombo = ({
  term,
  definition
}: {
  term: React.ReactNode;
  definition: string | undefined;
}) => {
  return (
    <>
      <DescriptionTerm term={term} className="margin-bottom-0" />
      <DescriptionDefinition
        className="text-pre-wrap margin-bottom-0"
        definition={<RichTextViewer value={definition} />}
      />
    </>
  );
};

const LcidInfoContainer = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const {
    decisionState,
    rejectionReason,
    lcid,
    lcidIssuedAt,
    lcidExpiresAt,
    lcidScope,
    lcidCostBaseline,
    lcidStatus,
    lcidRetiresAt
  } = useDecision();

  // one place for icon + background
  const decisionView = {
    [SystemIntakeDecisionState.LCID_ISSUED]: {
      icon: Icon.CheckCircle,
      bg: 'bg-success-dark'
    },
    [SystemIntakeDecisionState.NOT_APPROVED]: {
      icon: Icon.Cancel,
      bg: 'bg-error-dark'
    },
    [SystemIntakeDecisionState.NOT_GOVERNANCE]: {
      icon: Icon.Cancel,
      bg: 'bg-base-dark'
    },
    [SystemIntakeDecisionState.NO_DECISION]: {
      icon: Icon.Info,
      bg: ''
    }
  } as const;

  const { icon: IconComponent, bg } = decisionView[decisionState];

  return (
    <div className="margin-bottom-3">
      <div
        className={`margin-top-5 padding-2 display-flex flex-align-center ${bg}`}
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
                {lcidStatus && (
                  <LcidStatusTag
                    lcidStatus={lcidStatus}
                    lcidExpiresAt={lcidExpiresAt}
                    lcidRetiresAt={lcidRetiresAt}
                  />
                )}
              </div>

              <DefinitionCombo
                term={t('decision.terms.lcidNumber')}
                definition={lcid ?? t('lifecycleID.noLCID')}
              />

              <div className="grid-row">
                <Grid tablet={{ col: 6 }}>
                  <DefinitionCombo
                    term={t('decision.terms.issueDate')}
                    definition={
                      formatDateLocal(lcidIssuedAt, 'MM/dd/yyyy') ??
                      t('decision.noDateSet')
                    }
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DefinitionCombo
                    term={t('decision.terms.expirationDate')}
                    definition={
                      formatDateLocal(lcidExpiresAt, 'MM/dd/yyyy') ??
                      t('decision.noDateSet')
                    }
                  />
                </Grid>
              </div>

              <DefinitionCombo
                term={t('decision.terms.scope')}
                definition={lcidScope ?? t('notes.extendLcid.noScope')}
              />
              <DefinitionCombo
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
                term={t('decision.reason')}
                definition={rejectionReason || t('decision.noRejectionReasons')}
              />
            </>
          )}
        </dl>
      </div>
    </div>
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
  trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null;
  lcidStatus?: SystemIntakeLCIDStatus | null;
  lcidRetiresAt?: string | null;
};

const Decision = ({
  decisionNextSteps,
  decisionState,
  trbFollowUpRecommendation,
  ...rest
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
        <DecisionContext.Provider
          value={{
            decisionState,
            ...rest
          }}
        >
          <LcidInfoContainer />
          {decisionState !== SystemIntakeDecisionState.NOT_GOVERNANCE && (
            <dl className="padding-x-2">
              <DefinitionCombo
                term={t('decision.terms.nextSteps')}
                definition={
                  decisionNextSteps || t('notes.extendLcid.noNextSteps')
                }
              />
              {trbFollowUpRecommendation && (
                <DefinitionCombo
                  term={t('decision.terms.consultTRB')}
                  definition={t(
                    `action:issueLCID.trbFollowup.${trbFollowUpRecommendation}`
                  )}
                />
              )}
            </dl>
          )}
        </DecisionContext.Provider>
      )}
    </>
  );
};

export default Decision;
