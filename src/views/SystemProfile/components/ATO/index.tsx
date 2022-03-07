import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import {
  tempATOProp,
  tempCedarSystemProps
} from 'views/Sandbox/mockSystemData';

import './index.scss';

type ATOProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const ATO = ({ system }: ATOProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="ato">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-4"
            >
              <h2 className="margin-top-0 margin-bottom-4">
                {t('singleSystem.ato.header')}
              </h2>

              {/* TODO:  Map status to card colors */}
              <CardGroup className="margin-0">
                <Card
                  className={classnames('grid-col-12', {
                    'bg-success-dark': system.atoStatus === 'Active',
                    'bg-warning':
                      system.atoStatus === 'Due Soon' ||
                      system.atoStatus === 'In Progress',
                    'bg-error-dark': system.atoStatus === 'Expired',
                    'bg-base-lighter': system.atoStatus === 'No ATO'
                  })}
                >
                  <CardHeader
                    className={classnames(
                      'padding-2 padding-bottom-0 text-top',
                      {
                        'text-white':
                          system.atoStatus === 'Active' ||
                          system.atoStatus === 'Expired',
                        'text-base-darkest':
                          system.atoStatus === 'Due Soon' ||
                          system.atoStatus === 'No ATO' ||
                          system.atoStatus === 'In Progress'
                      }
                    )}
                  >
                    <DescriptionTerm term={t('singleSystem.ato.status')} />
                    <DescriptionDefinition
                      className="line-height-body-3 font-body-lg text-bold margin-bottom-2"
                      definition={
                        system.atoStatus === 'No ATO'
                          ? 'No ATO on file'
                          : system.atoStatus
                      }
                    />
                    {system.atoStatus !== 'No ATO' && (
                      <Divider
                        className={classnames('grid-col-12', {
                          'border-success-darker':
                            system.atoStatus === 'Active',
                          'border-warning-dark':
                            system.atoStatus === 'Due Soon' ||
                            system.atoStatus === 'In Progress',
                          'border-error-darker': system.atoStatus === 'Expired',
                          'border-base-light': system.atoStatus === 'No ATO'
                        })}
                      />
                    )}
                  </CardHeader>
                  {system.atoStatus !== 'No ATO' && (
                    <CardFooter
                      className={classnames('padding-2', {
                        'text-white':
                          system.atoStatus === 'Active' ||
                          system.atoStatus === 'Expired',
                        'text-base-darkest':
                          system.atoStatus === 'Due Soon' ||
                          system.atoStatus === 'No ATO' ||
                          system.atoStatus === 'In Progress'
                      })}
                    >
                      <DescriptionTerm
                        term={t('singleSystem.ato.expiration')}
                      />
                      <DescriptionDefinition
                        className="line-height-body-3 font-body-md"
                        definition="September 15, 2022"
                      />
                    </CardFooter>
                  )}
                </Card>
              </CardGroup>

              {system.atoStatus === 'No ATO' && (
                <Grid row gap className="margin-top-0 margin-bottom-4">
                  <Grid tablet={{ col: 12 }}>
                    <Alert type="info">{t('singleSystem.ato.noATO')}</Alert>
                  </Grid>
                </Grid>
              )}

              {system.atoStatus === 'In Progress' && (
                // @ts-expect-error
                <ProcessList>
                  {system?.activities?.map((act: tempATOProp) => (
                    <ProcessListItem key={act.id}>
                      <ProcessListHeading
                        type="h4"
                        className="easi-header__basic flex-align-start"
                      >
                        <div className="margin-0 font-body-lg">
                          Start a process
                        </div>
                        <div className="text-right margin-bottom-0">
                          <Tag
                            className={classnames(
                              'font-body-md',
                              'margin-bottom-1',
                              {
                                'bg-success-dark text-white':
                                  act.status === 'Completed',
                                'bg-warning': act.status === 'In progress',
                                'bg-white text-base border-base border-2px':
                                  act.status === 'Not started'
                              }
                            )}
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
                      <DescriptionTerm
                        term={t('singleSystem.ato.activityOwner')}
                      />
                      <DescriptionDefinition
                        className="line-height-body-3 font-body-md margin-bottom-0"
                        definition={act.activityOwner}
                      />
                    </ProcessListItem>
                  ))}
                </ProcessList>
              )}

              {/* TODO: Map and populate tags with CEDAR */}
              <h3 className="margin-top-2 margin-bottom-1">
                {t('singleSystem.ato.methodologies')}
              </h3>
              {system?.developmentTags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter"
                >
                  <i className="fa fa-check-circle text-primary-dark margin-right-1" />
                  {tag} {/* TODO: Map defined CEDAR variable once availabe */}
                </Tag>
              ))}
            </SectionWrapper>
            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-5"
            >
              <h2 className="margin-top-0">{t('singleSystem.ato.POAM')}</h2>

              {system.atoStatus === 'No ATO' && (
                <Grid row gap className="margin-top-2 margin-bottom-2">
                  <Grid tablet={{ col: 12 }}>
                    <Alert type="info">{t('singleSystem.ato.noATOPOAM')}</Alert>
                  </Grid>
                </Grid>
              )}

              {/* TODO: Map and populate tags with CEDAR */}
              {system.atoStatus !== 'No ATO' && (
                <div>
                  <Grid row gap className="margin-top-2">
                    <Grid tablet={{ col: 6 }} className="padding-right-2">
                      <DescriptionTerm term={t('singleSystem.ato.totalPOAM')} />
                      <DescriptionDefinition
                        className="line-height-body-3 margin-bottom-4"
                        definition="12"
                      />
                    </Grid>
                    <Grid tablet={{ col: 6 }} className="padding-right-2">
                      <DescriptionTerm term={t('singleSystem.ato.highPOAM')} />
                      <DescriptionDefinition
                        className="line-height-body-3 margin-bottom-4"
                        definition="4"
                      />
                    </Grid>
                  </Grid>

                  <Grid row gap className="margin-top-2 margin-bottom-2">
                    <Grid tablet={{ col: 12 }}>
                      <Alert type="info">
                        {t('singleSystem.ato.cfactsInfo')}
                      </Alert>
                    </Grid>
                  </Grid>
                </div>
              )}
              {/* TODO: Fill external CFACT link */}
              <Link href="/" target="_blank">
                <Button type="button" outline>
                  {t('singleSystem.ato.viewPOAMs')}
                </Button>
              </Link>
            </SectionWrapper>

            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-5"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.ato.securityFindings')}
              </h2>

              {system.atoStatus === 'No ATO' && (
                <Grid row gap className="margin-top-2 margin-bottom-2">
                  <Grid tablet={{ col: 12 }}>
                    <Alert type="info">{t('singleSystem.ato.noATOPOAM')}</Alert>
                  </Grid>
                </Grid>
              )}

              {/* TODO: Map and populate tags with CEDAR */}
              {system.atoStatus !== 'No ATO' && (
                <Grid row gap className="margin-top-2 margin-bottom-2">
                  <Grid className="padding-right-2 grid-col-6">
                    <DescriptionTerm
                      term={t('singleSystem.ato.totalFindings')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="12"
                    />
                    <DescriptionTerm
                      term={t('singleSystem.ato.mediumFindings')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="2"
                    />
                  </Grid>
                  <Grid className="padding-right-2 grid-col-6">
                    <DescriptionTerm
                      term={t('singleSystem.ato.highFindings')}
                    />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="4"
                    />
                    <DescriptionTerm term={t('singleSystem.ato.lowFindings')} />
                    <DescriptionDefinition
                      className="line-height-body-3 margin-bottom-4"
                      definition="6"
                    />
                  </Grid>
                </Grid>
              )}
              {/* TODO: Fill external CFACT link */}
              <Link href="/" target="_blank">
                <Button type="button" outline>
                  {t('singleSystem.ato.viewFindings')}
                </Button>
              </Link>
            </SectionWrapper>

            <SectionWrapper
              borderBottom={isMobile}
              className="margin-bottom-4 padding-bottom-6"
            >
              <h2 className="margin-top-0 margin-bottom-2">
                {t('singleSystem.ato.datesAndTests')}
              </h2>

              {system.atoStatus === 'No ATO' && (
                <Grid row gap className="margin-top-2 margin-bottom-2">
                  <Grid tablet={{ col: 12 }}>
                    <Alert type="info">
                      {t('singleSystem.ato.noATODates')}
                    </Alert>
                  </Grid>
                </Grid>
              )}

              {/* TODO: Map and populate tags with CEDAR */}
              {system.atoStatus !== 'No ATO' && (
                <div>
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
                </div>
              )}
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            tablet={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            {/* Setting a ref here to reference the grid width for the fixed side nav */}
            <div className="side-divider">
              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <h3 className="system-profile__subheader margin-bottom-1">
                Geraldine Hobbs
              </h3>
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <Link
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </p>
              <p>
                <Link
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </Link>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default ATO;
