import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridContainer,
  Tag
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { ReactComponent as VerifiedUserIcon } from 'uswds/src/img/usa-icons/verified_user.svg';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import useCheckResponsiveScreen from 'utils/checkMobile';
import {
  tempCedarSystemProps,
  tempLocationProp
} from 'views/Sandbox/mockSystemData';

import './index.scss';

// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

type SystemDetailsProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type,
  topScrollHeight: number | null;
};

const checkURLsExist = (locations: tempLocationProp[]): boolean => {
  return locations.some((location: tempLocationProp) => location.url);
};

const SystemDetails = ({ system, topScrollHeight }: SystemDetailsProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const containerRef = useRef<HTMLDivElement | null>(null); // Used for maintaining width of contact grid once element becomes fixed upon scrolling
  const [fixedPosition, setFixedPosition] = useState(false); // Controlls the state of fixed elements
  const [containerWidth, setContainerWidth] = useState<Number | null>(null); // Sets the width of elements once the become fixed

  // Hander for setting side nav as fixed element once element is scroll to top of window
  const handleScroll = () => {
    if (topScrollHeight && window.scrollY > topScrollHeight) {
      setFixedPosition(true);
    } else {
      setFixedPosition(false);
    }
  };

  // Hook for attaching scroll handle listener
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });

  // Sets the width of the fixed element once scroll threshold reached
  useLayoutEffect(() => {
    if (containerRef?.current?.clientWidth) {
      setContainerWidth(containerRef?.current?.clientWidth);
    }
  }, []);

  return (
    <div id="system-detail">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row>
          <Grid desktop={{ col: 9 }}>
            <SectionWrapper borderBottom className="padding-bottom-4">
              <PageHeading headingLevel="h2" className="margin-top-0">
                {t('singleSystem.systemDetails.header')}
              </PageHeading>

              {/* TODO: Map <DescriptionTerm /> to CEDAR data */}
              <Grid row className="margin-top-3">
                <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.ownership')}
                  />
                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="CMS owned"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.usersPerMonth')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 font-body-md"
                    definition="2,345"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.access')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition="Both public and internal access"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.fismaID')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition="123-456-789-0"
                  />
                </Grid>
              </Grid>

              {/* TODO: Map and populate tags with CEDAR */}
              <PageHeading
                noFocus
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {t('singleSystem.systemDetails.tagHeader1')}
              </PageHeading>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Fee for Service (FFS)
              </Tag>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Million Hearts
              </Tag>
              <PageHeading
                noFocus
                headingLevel="h3"
                className="margin-top-3 margin-bottom-1"
              >
                {t('singleSystem.systemDetails.tagHeader2')}
              </PageHeading>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Next Generation ACO Model
              </Tag>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Comprehensive Primary Care Plus
              </Tag>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Independence at Home Demonstration
              </Tag>
            </SectionWrapper>

            <SectionWrapper
              borderBottom
              className="padding-bottom-3 margin-bottom-3"
            >
              <PageHeading noFocus headingLevel="h2" className="margin-top-3">
                {t('singleSystem.systemDetails.urlsAndLocations')}
              </PageHeading>

              <DescriptionTerm
                term={t('singleSystem.systemDetails.migrationDate')}
              />
              <DescriptionDefinition
                className="line-height-body-3 margin-bottom-4"
                definition={
                  'December 12, 2017' ||
                  t('singleSystem.systemDetails.noMigrationDate')
                }
              />

              {system.locations && !checkURLsExist(system.locations) && (
                <Alert type="info" className="margin-bottom-2">
                  {t('singleSystem.systemDetails.noURL')}
                </Alert>
              )}

              {system?.locations?.map(
                (location: tempLocationProp): React.ReactNode => (
                  <Card
                    key={location.id}
                    data-testid="system-card"
                    className="grid-col-12"
                  >
                    <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                      <dt>{location.environment}</dt>
                      <div>
                        <dd className="text-right text-base-dark system-profile__icon-container">
                          <VerifiedUserIcon
                            width="1rem"
                            height="1rem"
                            fill="#00a91c"
                            className="margin-right-1"
                            aria-label="verified"
                          />

                          {/* <i className="fa fa-check-circle text-success margin-right-1" /> */}
                          <span className="text-tbottom line-height-body-3">
                            {location.firewall && 'Web Application Firewall'}
                          </span>

                          {/* TODO: Map defined CEDAR variable once availabe */}
                        </dd>
                      </div>
                    </CardHeader>

                    <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                      <h2 className="link-header margin-top-0 margin-bottom-2">
                        {location.url ? (
                          <UswdsReactLink
                            className="system-profile__card-link"
                            variant="external"
                            to={location.url}
                          >
                            {location.url}
                          </UswdsReactLink>
                        ) : (
                          <dd className="margin-left-0">
                            {t('singleSystem.systemDetails.noEnvironmentURL')}
                            {/* TODO: Map defined CEDAR variable once availabe */}
                          </dd>
                        )}
                      </h2>
                      {location?.tags?.map((tag: string) => (
                        <Tag
                          key={tag}
                          className="system-profile__tag margin-bottom-2 text-base-darker bg-base-lighter"
                        >
                          {tag}{' '}
                          {/* TODO: Map defined CEDAR variable once availabe */}
                        </Tag>
                      ))}

                      <Divider />
                    </CardBody>
                    <CardFooter className="padding-0">
                      <Grid row>
                        <Grid desktop={{ col: 6 }} className="padding-2">
                          <DescriptionTerm
                            term={t('singleSystem.systemDetails.location')}
                          />
                          <DescriptionDefinition
                            className="line-height-body-3"
                            definition={location.location}
                          />
                        </Grid>
                        <Grid desktop={{ col: 6 }} className="padding-2">
                          <DescriptionTerm
                            term={t('singleSystem.systemDetails.cloudProvider')}
                          />
                          <DescriptionDefinition
                            className="line-height-body-3"
                            definition={location.cloudProvider}
                          />
                        </Grid>
                      </Grid>
                    </CardFooter>
                  </Card>
                )
              )}
            </SectionWrapper>

            <SectionWrapper
              borderBottom
              className="padding-bottom-5 margin-bottom-4"
            >
              <PageHeading
                noFocus
                headingLevel="h2"
                className="margin-top-4 margin-bottom-1"
              >
                {t('singleSystem.systemDetails.development')}
              </PageHeading>

              {system.developmentTags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter"
                >
                  <i className="fa fa-check-circle text-primary-dark margin-right-1" />
                  {tag} {/* TODO: Map defined CEDAR variable once availabe */}
                </Tag>
              ))}

              {/* TODO: Map and populate tags with CEDAR */}
              <Grid row className="margin-top-3">
                <Grid desktop={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.customDevelopment')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="85%"
                  />
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.workCompleted')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="Every two weeks"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }}>
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.releaseFrequency')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="92%"
                  />
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.retirement')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="No planned retirement or replacement"
                  />
                </Grid>
                <Grid desktop={{ col: 12 }}>
                  <DescriptionTerm
                    term={t(
                      'singleSystem.systemDetails.developmentDescription'
                    )}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla volutpat elementum nibh feugiat donec. Ultricies at libero nullam egestas ipsum, sed."
                  />
                </Grid>
                <Grid desktop={{ col: 12 }}>
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.aiTechStatus')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition={system.status}
                  />
                </Grid>
                <Grid desktop={{ col: 12 }}>
                  <PageHeading
                    noFocus
                    headingLevel="h3"
                    className="margin-top-0 margin-bottom-1"
                  >
                    {t('singleSystem.systemDetails.technologyTypes')}
                  </PageHeading>
                  {/* TODO: Map and populate tags with CEDAR */}
                  <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                    Natural Language Processing
                  </Tag>
                  <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                    Chat Bots
                  </Tag>
                </Grid>
              </Grid>
            </SectionWrapper>

            <SectionWrapper borderBottom={isMobile} className="margin-bottom-5">
              <PageHeading
                noFocus
                headingLevel="h2"
                className="margin-top-3 margin-bottom-1"
              >
                {t('singleSystem.systemDetails.ipInfo')}
              </PageHeading>

              {/* TODO: Map defined CEDAR variable once availabe */}
              <Tag className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter">
                <i className="fa fa-check-circle text-primary-dark margin-right-1" />
                E-CAP Initiative
              </Tag>

              {/* TODO: Map and populate tags with CEDAR */}
              <Grid row className="margin-top-2">
                <Grid desktop={{ col: 6 }} className="padding-right-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.currentIP')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="IPv4 only"
                  />
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.ipAssets')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="This system will be transitioned to IPv6"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="padding-right-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.ipv6Transition')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="21"
                  />
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.percentTransitioned')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="25%"
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="padding-right-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.hardCodedIP')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-4"
                    definition="This system has hard-coded IP addresses"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            desktop={{ col: 9 }}
            className={classnames('padding-right-2', 'side-divider', {
              'hide-nav': !fixedPosition
            })}
          />
          <Grid desktop={{ col: 3 }}>
            <div ref={containerRef} style={{ width: '100%' }} />
            <div
              style={{
                width: fixedPosition ? `${containerWidth}px` : '100%'
              }}
              className={classnames('padding-right-2', 'side-divider', {
                'fixed-nav': fixedPosition && !isMobile
              })}
            >
              {/* Setting a ref here to reference the grid width for the fixed side nav */}

              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <DescriptionTerm
                className="system-profile__subheader margin-bottom-1"
                term="Geraldine Hobbs"
              />
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <UswdsReactLink
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  to="/" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </UswdsReactLink>
              </p>
              <p>
                <UswdsReactLink
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  to="/" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </UswdsReactLink>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemDetails;
