import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  IconCheckCircle,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { camelCase } from 'lodash';

import Alert from 'components/shared/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import { securityFindingKeys } from 'constants/systemProfile';
import useCheckResponsiveScreen from 'hooks/checkMobile';
// eslint-disable-next-line camelcase
import { GetSystemProfile_cedarThreat } from 'queries/types/GetSystemProfile';
import {
  SecurityFindings,
  SystemProfileSubviewProps,
  ThreatLevel
} from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';
import { showAtoExpirationDate } from 'views/SystemProfile/helpers';

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

const ATO = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const { ato, atoStatus, developmentTags, cedarThreat } = system;

  const fields = useMemo(() => {
    return {
      securityFindings: cedarThreat && getSecurityFindings(cedarThreat)
    };
  }, [cedarThreat]);

  const { securityFindings } = fields;

  return (
    <>
      <SectionWrapper borderBottom className="margin-bottom-4 padding-bottom-4">
        <h2 className="margin-top-0 margin-bottom-4">
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
                  <DescriptionTerm term={t('singleSystem.ato.expiration')} />
                  <DescriptionDefinition
                    className="line-height-body-3 font-body-md"
                    definition={showAtoExpirationDate(
                      ato.dateAuthorizationMemoExpires
                    )}
                  />
                </CardFooter>
              )}
            </Card>
          </CardGroup>
        ) : (
          <Grid row gap className="margin-top-0 margin-bottom-4">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noEmailContact')}</Alert>
            </Grid>
          </Grid>
        )}

        {flags.systemProfileHiddenFields && system.activities !== undefined && (
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

        {flags.systemProfileHiddenFields && (
          <>
            <h3 className="margin-top-2 margin-bottom-1">
              {t('singleSystem.ato.methodologies')}
            </h3>
            {developmentTags?.map(tag => (
              <Tag
                key={tag}
                className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter"
              >
                <IconCheckCircle className="text-primary-dark margin-right-1" />
                {tag}
              </Tag>
            ))}
          </>
        )}
      </SectionWrapper>
      <SectionWrapper borderBottom className="margin-bottom-4">
        <h2 className="margin-top-0">{t('singleSystem.ato.POAM')}</h2>

        {atoStatus === 'No ATO' && (
          <Grid row gap className="margin-top-2 margin-bottom-2">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noEmailContact')}</Alert>
            </Grid>
          </Grid>
        )}

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
              {flags.systemProfileHiddenFields && (
                <Grid tablet={{ col: 6 }} className="padding-right-2">
                  <DescriptionTerm term={t('singleSystem.ato.highPOAM')} />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="4"
                  />
                </Grid>
              )}
            </Grid>

            {flags.systemProfileHiddenFields && (
              <Grid row gap className="margin-top-2 margin-bottom-2">
                <Grid tablet={{ col: 12 }}>
                  <Alert type="info">{t('singleSystem.ato.cfactsInfo')}</Alert>
                </Grid>
              </Grid>
            )}
          </div>
        )}
        {/* TODO: Fill external CFACT link */}
        {flags.systemProfileHiddenFields && (
          <Link href="/" target="_blank">
            <Button type="button" outline>
              {t('singleSystem.ato.viewPOAMs')}
            </Button>
          </Link>
        )}
      </SectionWrapper>

      {securityFindings && (
        <SectionWrapper borderBottom className="margin-bottom-4">
          <h2 className="margin-top-0">
            {t('singleSystem.ato.securityFindings')}
          </h2>

          {atoStatus === 'No ATO' && (
            <Grid row gap className="margin-top-2 margin-bottom-2">
              <Grid tablet={{ col: 12 }}>
                <Alert type="info">
                  {t('singleSystem.ato.noEmailContact')}
                </Alert>
              </Grid>
            </Grid>
          )}

          {atoStatus !== 'No ATO' && (
            <Grid row gap className="margin-top-2 margin-bottom-2">
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
          {/* TODO: Fill external CFACT link */}
          {flags.systemProfileHiddenFields && (
            <Link href="/" target="_blank">
              <Button type="button" outline>
                {t('singleSystem.ato.viewFindings')}
              </Button>
            </Link>
          )}
        </SectionWrapper>
      )}

      <SectionWrapper
        borderBottom={isMobile}
        className="margin-bottom-4 padding-bottom-6"
      >
        <h2 className="margin-top-0 margin-bottom-2">
          {t('singleSystem.ato.datesAndTests')}
        </h2>

        {atoStatus === 'No ATO' && (
          <Grid row gap className="margin-top-2 margin-bottom-2">
            <Grid tablet={{ col: 12 }}>
              <Alert type="info">{t('singleSystem.ato.noATODates')}</Alert>
            </Grid>
          </Grid>
        )}

        {/* TODO: Map and populate tags with CEDAR */}
        {atoStatus !== 'No ATO' && (
          <div>
            {flags.systemProfileHiddenFields ? (
              <>
                <Grid row gap>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm term={t('singleSystem.ato.lastTest')} />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="Oct 12, 2021"
                    />
                  </Grid>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.lastAssessment')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="September 24, 2021"
                    />
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.contingencyCompletion')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="March 18, 2022"
                    />
                  </Grid>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.contingencyTest')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="January 7, 2022"
                    />
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.securityReview')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="Dec 2, 2021"
                    />
                  </Grid>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.authorizationExpiration')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="April 14, 2022"
                    />
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.piaCompletion')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="Oct 14, 2021"
                    />
                  </Grid>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm
                      term={t('singleSystem.ato.sornCompletion')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="September 2, 2021"
                    />
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid tablet={{ col: 6 }}>
                    <DescriptionTerm term={t('singleSystem.ato.lastSCA')} />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="September 2, 2021"
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.ato.lastAssessment')}
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
            )}
          </div>
        )}
      </SectionWrapper>
    </>
  );
};

export default ATO;
