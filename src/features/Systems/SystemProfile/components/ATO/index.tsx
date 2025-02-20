import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Card,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  Icon,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  showAtoEffectiveDate,
  showAtoExpirationDate
} from 'features/Systems/SystemProfile/helpers';
// eslint-disable-next-line camelcase
import { GetSystemProfile_cedarThreat } from 'gql/legacyGQL/types/GetSystemProfile';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { camelCase } from 'lodash';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import HelpText from 'components/HelpText';
import SectionWrapper from 'components/SectionWrapper';
import Tag from 'components/Tag';
import { securityFindingKeys } from 'constants/systemProfile';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import {
  SecurityFindings,
  SystemProfileSubviewProps,
  ThreatLevel
} from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

import './index.scss';

/**
 * Get counts of Security Findings from Cedar threat levels.
 */
function getSecurityFindings(
  // eslint-disable-next-line camelcase
  cedarThreat: GetSystemProfile_cedarThreat[]
): SecurityFindings {
  // Init finding props with 0 count
  const findings = Object.fromEntries(
    securityFindingKeys.map(k => [k, 0])
  ) as SecurityFindings;

  // eslint-disable-next-line no-restricted-syntax
  for (const threat of cedarThreat) {
    const riskLevel = threat.weaknessRiskLevel as ThreatLevel;
    if (riskLevel !== null) {
      findings[riskLevel] += 1;
      findings.total += 1;
    }
  }
  return findings;
}

function getLongestOpenFinding(
  // eslint-disable-next-line camelcase
  cedarThreat: GetSystemProfile_cedarThreat[]
): number {
  let longestOpenFinding = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const threat of cedarThreat) {
    const { daysOpen } = threat;
    if (daysOpen !== null && daysOpen > longestOpenFinding) {
      longestOpenFinding = daysOpen;
    }
  }
  return longestOpenFinding;
}

const ATO = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const { ato, atoStatus, cedarThreat } = system;

  const fields = useMemo(() => {
    return {
      securityFindings: cedarThreat && getSecurityFindings(cedarThreat),
      longestOpenFinding: getLongestOpenFinding(cedarThreat)
    };
  }, [cedarThreat]);

  const { securityFindings, longestOpenFinding } = fields;

  return (
    <>
      <SectionWrapper borderBottom className="margin-bottom-4 padding-bottom-4">
        <h2 id="ato" className="margin-top-0 margin-bottom-4">
          {t('singleSystem.ato.header')}
        </h2>

        {ato ? (
          <CardGroup className="margin-0">
            <Card
              className={classnames('grid-col-12', {
                'bg-success-dark': atoStatus === 'Active',
                'bg-warning': atoStatus === 'Due Soon',
                'bg-error-dark': atoStatus === 'Expired',
                'bg-base-lighter': atoStatus === 'No ATO'
              })}
            >
              <CardHeader
                className={classnames('padding-2 padding-bottom-0 text-top', {
                  'text-white':
                    atoStatus === 'Active' || atoStatus === 'Expired',
                  'text-base-darkest':
                    atoStatus === 'Due Soon' || atoStatus === 'No ATO'
                })}
              >
                <DescriptionTerm term={t('singleSystem.ato.status')} />
                <DescriptionDefinition
                  className="line-height-body-3 font-body-lg text-bold margin-bottom-2"
                  definition={
                    atoStatus === 'No ATO' ? 'No ATO on file' : atoStatus
                  }
                />
                {atoStatus !== 'No ATO' && (
                  <Divider
                    className={classnames('grid-col-12', {
                      'border-success-darker': atoStatus === 'Active',
                      'border-warning-dark': atoStatus === 'Due Soon',
                      'border-error-darker': atoStatus === 'Expired'
                    })}
                  />
                )}
              </CardHeader>
              {atoStatus !== 'No ATO' && (
                <CardFooter
                  className={classnames('padding-2', {
                    'text-white':
                      atoStatus === 'Active' || atoStatus === 'Expired',
                    'text-base-darkest': atoStatus === 'Due Soon'
                  })}
                >
                  <Grid row>
                    <Grid desktop={{ col: 6 }}>
                      <DescriptionTerm
                        term={t('singleSystem.ato.expirationDate')}
                      />
                      <DescriptionDefinition
                        className="line-height-body-3 font-body-md"
                        definition={showAtoExpirationDate(
                          ato.dateAuthorizationMemoExpires
                        )}
                      />
                    </Grid>
                    <Grid desktop={{ col: 6 }}>
                      <DescriptionTerm
                        term={t('singleSystem.ato.effectiveDate')}
                      />
                      <DescriptionDefinition
                        className="line-height-body-3 font-body-md"
                        definition={showAtoEffectiveDate(ato)}
                      />
                    </Grid>
                  </Grid>
                </CardFooter>
              )}
            </Card>
            {/* If ATO exists display HelpText describing ATO expiration logic, otherwise display 'no ATO' disclaimer */}
            {atoStatus !== 'No ATO' ? (
              <HelpText
                className="display-flex"
                data-testid="atoExpirationLogicHelpText"
              >
                <Icon.Info className="margin-right-1" />
                {t('singleSystem.ato.atoExpiringSoonLogicInfo')}
              </HelpText>
            ) : (
              <Alert type="info" data-testid="noATOAlert" slim>
                <Trans
                  i18nKey="systemProfile:singleSystem.ato.noATODisclaimer"
                  components={{
                    link1: (
                      <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
                    )
                  }}
                />
              </Alert>
            )}
          </CardGroup>
        ) : (
          <Grid row gap className="margin-top-0 margin-bottom-4">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noEmailContact')}</Alert>
            </Grid>
          </Grid>
        )}

        {/* Hide ATO Process List behind feature flag */}
        {flags.atoProcessList && system.activities !== undefined && (
          <ProcessList>
            {system.activities.map(act => (
              <ProcessListItem key={act.id}>
                <ProcessListHeading
                  type="h4"
                  className="easi-header__basic flex-align-start"
                >
                  <div className="margin-0 font-body-lg">Start a process</div>
                  <div className="text-right margin-bottom-0">
                    <Tag
                      className={classnames('font-body-md', 'margin-bottom-1', {
                        'bg-success-dark text-white':
                          act.status === 'Completed',
                        'bg-warning': act.status === 'In progress',
                        'bg-white text-base border-base border-2px':
                          act.status === 'Not started'
                      })}
                    >
                      {act.status}
                    </Tag>
                    <h5 className="text-normal margin-y-0 text-base-dark">
                      {act.status === 'Completed'
                        ? t('singleSystem.ato.completed')
                        : t('singleSystem.ato.due')}
                      {act.dueDate}
                    </h5>
                  </div>
                </ProcessListHeading>
                <DescriptionTerm term={t('singleSystem.ato.activityOwner')} />
                <DescriptionDefinition
                  className="line-height-body-3 font-body-md margin-bottom-0"
                  definition={act.activityOwner}
                />
              </ProcessListItem>
            ))}
          </ProcessList>
        )}

        <SectionWrapper className="margin-bottom-4 margin-top-4">
          <SummaryBox>
            <SummaryBoxHeading headingLevel="h3">
              {t('singleSystem.ato.securityAndPrivacy.header')}
            </SummaryBoxHeading>
            <SummaryBoxContent>
              <p>{t('singleSystem.ato.securityAndPrivacy.atoInfo')}</p>
              <div className="margin-top-1">
                <Link
                  aria-label="Open 'Lean more about ATO' in a new tab"
                  className="line-height-body-5"
                  href="https://security.cms.gov/learn/authorization-operate-ato"
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.ato.securityAndPrivacy.learnMoreAboutATO')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </div>
              <p>{t('singleSystem.ato.securityAndPrivacy.cfactsInfo')}</p>
              <div className="margin-top-1 margin-bottom-2">
                <Link
                  aria-label="Open 'CFACTS' in a new tab"
                  className="line-height-body-5"
                  href="https://cfacts.cms.gov"
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.ato.goToCfacts')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </div>
              <Divider />
              <div className="margin-top-2">
                <Link
                  aria-label="Open 'Cybergeek' in a new tab"
                  className="line-height-body-5"
                  href="https://security.cms.gov"
                  variant="external"
                  target="_blank"
                >
                  {t(
                    'singleSystem.ato.securityAndPrivacy.learnMoreAboutSecurityAndPrivacy'
                  )}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </div>
            </SummaryBoxContent>
          </SummaryBox>
        </SectionWrapper>
        {/* TODO: add security methodologies and programs (e.g. Zero Trust, DevSecOps) when/if data becomes available */}
      </SectionWrapper>

      <SectionWrapper borderBottom className="margin-bottom-4">
        <h2 id="poamsAndFindings" className="margin-top-0">
          {t('singleSystem.ato.POAMandSecurityFindings')}
        </h2>

        {atoStatus === 'No ATO' && (
          <Grid row gap className="margin-top-2 margin-bottom-2">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noEmailContact')}</Alert>
            </Grid>
          </Grid>
        )}

        {/* TODO: can we combine/simplify all these No ATO checks */}
        {atoStatus !== 'No ATO' && (
          <div>
            <Grid row gap className="margin-top-2">
              <Grid tablet={{ col: 6 }} className="padding-right-2">
                <DescriptionTerm term={t('singleSystem.ato.totalPOAM')} />
                <DescriptionDefinition
                  className="line-height-body-3 margin-bottom-4"
                  definition={showVal(ato?.countOfOpenPoams)}
                />
              </Grid>
              <Grid tablet={{ col: 6 }} className="padding-right-2">
                <DescriptionTerm term={t('singleSystem.ato.longestOpenPOAM')} />
                <DescriptionDefinition
                  className="line-height-body-3 margin-bottom-4"
                  definition={showVal(longestOpenFinding)}
                />
              </Grid>
            </Grid>
          </div>
        )}

        {atoStatus !== 'No ATO' && (
          <Grid row gap>
            {securityFindingKeys
              .filter(
                k =>
                  k === 'total' || // always show total
                  securityFindings[k] !== 0 // otherwise hide 0 count
              )
              .map(k => {
                const camelKey = camelCase(k);
                return (
                  <Grid key={camelKey} className="padding-right-2 grid-col-6">
                    <DescriptionTerm
                      term={t(`singleSystem.ato.${camelKey}Findings`)}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition={securityFindings[k]}
                    />
                  </Grid>
                );
              })}
          </Grid>
        )}
        <Grid row gap className="margin-top-2 margin-bottom-2">
          <Grid tablet={{ col: 12 }}>
            <Alert type="info">
              {t('singleSystem.ato.cfactsAccessInfo')}
              <div className="margin-top-1">
                <Link
                  aria-label="Open 'CFACTS' in a new tab"
                  className="line-height-body-5"
                  href="https://cfacts.cms.gov"
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.ato.goToCfacts')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </div>
            </Alert>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Dates, Forms, and Testing */}
      <SectionWrapper borderBottom={isMobile}>
        <h2 id="datesFormsAndTesting" className="margin-top-0 margin-bottom-2">
          {t('singleSystem.ato.datesFormsAndTesting')}
        </h2>

        {atoStatus === 'No ATO' && (
          <Grid row gap className="margin-top-2 margin-bottom-2">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noATODates')}</Alert>
            </Grid>
          </Grid>
        )}
        {atoStatus !== 'No ATO' && (
          <div>
            <>
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastActScaDate')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={showVal(
                      ato?.lastActScaDate &&
                        formatDateUtc(ato.lastActScaDate, 'MMMM d, yyyy')
                    )}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm term={t('singleSystem.ato.lastPenTest')} />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={showVal(
                      ato?.lastPenTestDate &&
                        formatDateUtc(ato.lastPenTestDate, 'MMMM d, yyyy')
                    )}
                  />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm term={t('singleSystem.ato.lastPIA')} />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={showVal(
                      ato?.piaCompletionDate &&
                        formatDateUtc(ato.piaCompletionDate, 'MMMM d, yyyy')
                    )}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastATOAssessment')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={showVal(
                      ato?.lastAssessmentDate &&
                        formatDateUtc(ato.lastAssessmentDate, 'MMMM d, yyyy')
                    )}
                  />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm term={t('singleSystem.ato.lastSIA')} />
                  {/* TODO: remove this? SIA not listed in EA Data Dictionary */}
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={t('singleSystem.noDataAvailable')}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastDisasterRecoveryExercise')}
                  />
                  {/* TODO: display disaster recovery plan date once DR Exercise Date field is exposed through API */}
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={t('singleSystem.noDataAvailable')}
                  />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastContingencyCompletion')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={showVal(
                      ato?.lastContingencyPlanCompletionDate &&
                        formatDateUtc(
                          ato.lastContingencyPlanCompletionDate,
                          'MMMM d, yyyy'
                        )
                    )}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastDisasterRecoveryPlanUpdate')}
                  />
                  {/* TODO: display last disaster recovery plan update once Last DR Plan Update field is exposed through API */}
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={t('singleSystem.noDataAvailable')}
                  />
                </Grid>
              </Grid>
            </>
          </div>
        )}
      </SectionWrapper>

      {/* Documents Table */}
      <SectionWrapper>
        <Table bordered={false} fullWidth scrollable>
          <thead>
            <tr>
              <th scope="col" className="border-bottom-2px">
                {t('singleSystem.ato.documentType')}
              </th>
              <th scope="col" className="border-bottom-2px">
                {t('singleSystem.ato.doesSystemHaveDoc')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('singleSystem.ato.disasterRecoveryPlanDoc')}</td>
              {/* TODO: display yes/no for disaster recovery plan once DR Plan field is exposed through API */}
              <td>{t('singleSystem.noDataAvailable')}</td>
            </tr>
            <tr>
              <td>{t('singleSystem.ato.sornDoc')}</td>
              {ato?.systemOfRecordsNotice ? <td>Yes</td> : <td>No</td>}
            </tr>
            <tr>
              <td>{t('singleSystem.ato.contingencyPlanDoc')}</td>
              {ato?.lastContingencyPlanCompletionDate ? (
                <td>Yes</td>
              ) : (
                <td>No</td>
              )}
            </tr>
          </tbody>
        </Table>
      </SectionWrapper>

      {/* Acronym Definitions and Information */}
      <SectionWrapper className="margin-bottom-4 margin-top-4">
        <div className="margin-top-3 padding-2 bg-base-lightest">
          <h4 className="margin-top-0">
            {t('singleSystem.ato.acronymsDefined')}
          </h4>
          <Link
            aria-label="Open 'Full list of security acronyms' in a new tab'"
            className="line-height-body-5"
            href="https://security.cms.gov/learn/acronyms"
            variant="external"
            target="_blank"
          >
            {t('singleSystem.ato.acronymsFullList')}
            <span aria-hidden>&nbsp;</span>
          </Link>

          {/* ACT */}
          <p>{t('singleSystem.ato.actAcronym')}</p>

          {/* SCA */}
          <p>{t('singleSystem.ato.scaAcronym')}</p>

          {/* PIA */}
          <p>{t('singleSystem.ato.piaAcronym')}</p>
          <Link
            aria-label="Open 'Lean more about PIA' in a new tab"
            className="line-height-body-5"
            href="https://security.cms.gov/learn/privacy-impact-assessment-pia"
            variant="external"
            target="_blank"
          >
            {t('singleSystem.ato.piaLearnMore')}
            <span aria-hidden>&nbsp;</span>
          </Link>

          {/* SIA */}
          <p>{t('singleSystem.ato.siaAcronym')}</p>
          <Link
            aria-label="Open 'Lean more about SIA' in a new tab"
            className="line-height-body-5"
            href="https://security.cms.gov/learn/security-impact-analysis-sia"
            variant="external"
            target="_blank"
          >
            {t('singleSystem.ato.siaLearnMore')}
            <span aria-hidden>&nbsp;</span>
          </Link>

          {/* SORN */}
          <p>{t('singleSystem.ato.sornAcronym')}</p>
          <Link
            aria-label="Open 'Lean more about SORN' in a new tab"
            className="line-height-body-5"
            href="https://security.cms.gov/learn/system-records-notice-sorn"
            variant="external"
            target="_blank"
          >
            {t('singleSystem.ato.sornLearnMore')}
            <span aria-hidden>&nbsp;</span>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
};

export default ATO;
