import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  SystemIntakeDecisionState,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
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
  definition,
  isLast
}: {
  term: React.ReactNode;
  definition: React.ReactNode;
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

const LcidInfoContainer = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const {
    decisionState,
    rejectionReason,
    lcid,
    lcidIssuedAt,
    lcidExpiresAt,
    lcidScope,
    lcidCostBaseline
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
};

// const Decision = (props: DecisionProps) => {
const Decision = ({
  decisionNextSteps,
  decisionState,
  trbFollowUpRecommendation,
  ...rest
}: DecisionProps) => {
  // const { decisionNextSteps, decisionState, trbFollowUpRecommendation } = props;
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
            decisionNextSteps,
            decisionState,
            trbFollowUpRecommendation,
            ...rest
          }}
        >
          <LcidInfoContainer />
          {decisionState !== SystemIntakeDecisionState.NOT_GOVERNANCE && (
            <dl className="padding-x-2">
              <DefinitionCombo
                isLast
                term={t('decision.terms.nextSteps')}
                definition={
                  <RichTextViewer
                    value={
                      decisionNextSteps || t('notes.extendLcid.noNextSteps')
                    }
                  />
                }
              />
              <DefinitionCombo
                term={t('decision.terms.consultTRB')}
                definition={
                  trbFollowUpRecommendation &&
                  t(`action:issueLCID.trbFollowup.${trbFollowUpRecommendation}`)
                }
              />
            </dl>
          )}
        </DecisionContext.Provider>
      )}
    </>
  );
};

export default Decision;
