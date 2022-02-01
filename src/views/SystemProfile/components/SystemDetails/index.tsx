import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Tag
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import {
  tempCedarSystemProps,
  tempLocationProp
} from 'views/Sandbox/mockSystemData';

import './index.scss';

type SystemDetailsProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const checkURLsExist = (locations: tempLocationProp[]): boolean => {
  return locations.some((location: tempLocationProp) => location.url);
};

const SystemDetails = ({ system }: SystemDetailsProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <Grid
      className="grid-container padding-left-0 padding-right-0"
      id="system-detail"
    >
      <Grid row>
        <Grid desktop={{ col: 9 }}>
          <SectionWrapper borderBottom className="padding-bottom-5">
            <PageHeading headingLevel="h2" className="margin-top-0">
              {t('singleSystem.systemDetails.header')}
            </PageHeading>

            <Grid row className="margin-top-3">
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.ownership')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.usersPerMonth')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.access')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.fismaID')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
            </Grid>

            <PageHeading
              headingLevel="h3"
              className="margin-top-0 margin-bottom-1"
            >
              {t('singleSystem.systemDetails.tagHeader1')}
            </PageHeading>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter">
              Fee for Service (FFS)
              {/* TODO: Populate with CEDAR */}
            </Tag>

            <PageHeading
              headingLevel="h3"
              className="margin-top-4 margin-bottom-1"
            >
              {t('singleSystem.systemDetails.tagHeader2')}
            </PageHeading>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter">
              Next Generation ACO Model
              {/* TODO: Populate with CEDAR */}
            </Tag>
          </SectionWrapper>

          <SectionWrapper
            borderBottom
            className="padding-bottom-3 margin-bottom-3"
          >
            <PageHeading headingLevel="h2" className="margin-top-3">
              {t('singleSystem.systemDetails.urlsAndLocations')}
            </PageHeading>

            <DescriptionTerm
              term={t('singleSystem.systemDetails.migrationDate')}
            />
            <DescriptionDefinition
              className="font-body-md margin-bottom-4"
              definition={
                system.businessOwnerOrg ||
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
                <Card data-testid="system-card" className="grid-col-12">
                  <CardHeader className="easi-header__basic padding-left-2 padding-right-2">
                    <dt>{location.environment || ''}</dt>
                    <div>
                      <dd>
                        <i className="fa fa-check-circle text-success margin-right-1" />
                        {location.firewall && 'Web Application Firewall'}
                        {/* TODO: Map defined CEDAR variable once availabe */}
                      </dd>
                    </div>
                  </CardHeader>

                  <CardBody className="padding-left-2 padding-right-2 padding-bottom-0">
                    <h2 className="link-header margin-top-0 margin-bottom-2">
                      {location.url ? (
                        <UswdsReactLink
                          className="system-profile__card-link"
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
                      <Tag className="system-profile__tag margin-bottom-2 text-base-darker bg-base-lighter">
                        {tag || ''}{' '}
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
                          className="font-body-md"
                          definition={location.location || ''}
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="padding-2">
                        <DescriptionTerm
                          term={t('singleSystem.systemDetails.cloudProvider')}
                        />
                        <DescriptionDefinition
                          className="font-body-md"
                          definition={location.cloudProvider || ''}
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
            className="padding-bottom-5 margin-bottom-3"
          >
            <PageHeading
              headingLevel="h2"
              className="margin-top-3 margin-bottom-1"
            >
              {t('singleSystem.systemDetails.development')}
            </PageHeading>

            {system.developmentTags?.map((tag: string) => (
              <Tag className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter">
                <i className="fa fa-check-circle text-primary-dark margin-right-1" />
                {tag || ''}{' '}
                {/* TODO: Map defined CEDAR variable once availabe */}
              </Tag>
            ))}

            <Grid row className="margin-top-3">
              <Grid desktop={{ col: 6 }}>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.customDevelopment')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.businessOwnerOrg || ''}
                />
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.workCompleted')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }}>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.releaseFrequency')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.businessOwnerOrg || ''}
                />
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.retirement')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 12 }}>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.developmentDescription')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.description || ''}
                />
              </Grid>
              <Grid desktop={{ col: 12 }}>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.aiTechStatus')}
                />
                <DescriptionDefinition
                  className="font-body-md margin-bottom-4"
                  definition={system.status || ''}
                />
              </Grid>
              <Grid desktop={{ col: 12 }}>
                <PageHeading
                  headingLevel="h3"
                  className="margin-top-0 margin-bottom-1"
                >
                  {t('singleSystem.systemDetails.technologyTypes')}
                </PageHeading>
                {/* TODO: Populate tags with CEDAR */}
                <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                  Natural Language Processing
                </Tag>
                <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                  Chat Bots
                </Tag>
              </Grid>
            </Grid>
          </SectionWrapper>
        </Grid>
        {/* Point of contact/ miscellaneous info */}
        <Grid desktop={{ col: 3 }}>
          <div className="top-divider" />
          <p>{t('singleSystem.pointOfContact')}</p>
          <DescriptionTerm
            className="system-profile__subheader"
            term={system.businessOwnerOrgComp || ''}
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
              variant="external"
              target="_blank"
            >
              {t('singleSystem.moreContact')}
              <span aria-hidden>&nbsp;</span>
            </UswdsReactLink>
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SystemDetails;
