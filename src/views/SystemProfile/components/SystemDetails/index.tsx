import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  IconCheckCircle,
  IconVerifiedUser,
  Link
} from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/shared/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import formatNumber from 'utils/formatNumber';
import { showVal } from 'views/SystemProfile';

import 'index.scss';

const SystemDetails = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();
  const { locations, developmentTags, cedarSystemDetails } = system;
  return (
    <>
      <SectionWrapper borderBottom className="padding-bottom-4">
        <h2 className="margin-top-0 margin-bottom-4">
          {t('singleSystem.systemDetails.header')}
        </h2>

        <Grid row className="margin-top-3">
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm term={t('singleSystem.systemDetails.ownership')} />
            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={t(
                `singleSystem.systemDetails.ownershipValues.${
                  cedarSystemDetails?.businessOwnerInformation.isCmsOwned
                    ? 'cmsOwned'
                    : 'contractorOwned'
                }`
              )}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              term={t('singleSystem.systemDetails.usersPerMonth')}
            />
            <DescriptionDefinition
              className="line-height-body-3 font-body-md"
              definition={showVal(
                cedarSystemDetails?.businessOwnerInformation
                  .numberOfSupportedUsersPerMonth,
                { format: formatNumber }
              )}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm term={t('singleSystem.systemDetails.access')} />
            <DescriptionDefinition
              className="line-height-body-3"
              definition={showVal(
                cedarSystemDetails?.systemMaintainerInformation.netAccessibility
              )}
            />
          </Grid>
          {flags.systemProfileHiddenFields && (
            <Grid tablet={{ col: 6 }} className="margin-bottom-5">
              <DescriptionTerm term={t('singleSystem.systemDetails.fismaID')} />
              <DescriptionDefinition
                className="line-height-body-3"
                definition="123-456-789-0"
              />
            </Grid>
          )}
        </Grid>

        {flags.systemProfileHiddenFields && (
          <>
            <h3 className="margin-top-0 margin-bottom-1">
              {t('singleSystem.systemDetails.tagHeader1')}
            </h3>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
              Fee for Service (FFS)
            </Tag>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
              Million Hearts
            </Tag>
            <h3 className="margin-top-3 margin-bottom-1">
              {t('singleSystem.systemDetails.tagHeader2')}
            </h3>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
              Next Generation ACO Model
            </Tag>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
              Comprehensive Primary Care Plus
            </Tag>
            <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
              Independence at Home Demonstration
            </Tag>
          </>
        )}
      </SectionWrapper>

      <SectionWrapper borderBottom className="padding-bottom-3 margin-bottom-3">
        <h2 className="margin-top-3">
          {t('singleSystem.systemDetails.urlsAndLocations')}
        </h2>

        {flags.systemProfileHiddenFields && (
          <>
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
          </>
        )}

        {locations?.length ? (
          <CardGroup className="margin-0">
            {locations.map(location => (
              <Card
                key={location.id}
                data-testid="system-card"
                className="grid-col-12"
              >
                <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                  <dt>
                    {location.urlHostingEnv &&
                      `${location.urlHostingEnv} ${t(
                        'singleSystem.systemDetails.environment'
                      )}`}
                  </dt>
                  {location.isBehindWebApplicationFirewall && (
                    <div>
                      <dd className="text-right text-base-dark system-profile__icon-container">
                        <IconVerifiedUser
                          width="1rem"
                          color="#00a91c"
                          height="1rem"
                          className="margin-right-1"
                          aria-label="verified"
                        />
                        <span className="text-tbottom line-height-body-3">
                          {t(
                            'singleSystem.systemDetails.webApplicationFirewall'
                          )}
                        </span>
                      </dd>
                    </div>
                  )}
                </CardHeader>
                <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                  <h3 className="link-header margin-top-0 margin-bottom-2">
                    {location.address ? (
                      <Link
                        className="link-header url-card-link"
                        variant="external"
                        target="_blank"
                        href={location.address}
                      >
                        {location.address}
                      </Link>
                    ) : (
                      <dd className="margin-left-0">
                        {t('singleSystem.systemDetails.noEnvironmentURL')}
                      </dd>
                    )}
                  </h3>
                  {location.tags.map((tag: string) => (
                    <Tag
                      key={tag}
                      className="system-profile__tag margin-bottom-2 text-base-darker bg-base-lighter"
                    >
                      {tag}
                    </Tag>
                  ))}
                  <div />
                </CardBody>
                {location.deploymentDataCenterName && (
                  <CardFooter className="padding-0">
                    <Grid row>
                      <Divider className="margin-x-2" />
                      <Grid desktop={{ col: 12 }} className="padding-2">
                        <DescriptionTerm
                          term={t('singleSystem.systemDetails.provider')}
                        />
                        <DescriptionDefinition
                          className="line-height-body-3"
                          definition={location.deploymentDataCenterName}
                        />
                      </Grid>
                    </Grid>
                  </CardFooter>
                )}
              </Card>
            ))}
          </CardGroup>
        ) : (
          <Alert type="info" className="margin-bottom-2">
            {t('singleSystem.systemDetails.noURL')}
          </Alert>
        )}
      </SectionWrapper>

      <SectionWrapper
        borderBottom={flags.systemProfileHiddenFields || isMobile}
        className={
          flags.systemProfileHiddenFields
            ? 'padding-bottom-5 margin-bottom-4'
            : 'margin-bottom-5'
        }
      >
        <h2 className="margin-top-4 margin-bottom-1">
          {t('singleSystem.systemDetails.development')}
        </h2>

        {developmentTags?.map((tag: string) => (
          <Tag
            key={tag}
            className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter"
          >
            <IconCheckCircle className="system-profile__icon text-primary-dark margin-right-1" />
            {tag}
          </Tag>
        ))}

        <Grid row className="margin-top-3">
          <Grid desktop={{ col: 6 }}>
            {flags.systemProfileHiddenFields && (
              <>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.customDevelopment')}
                />
                <DescriptionDefinition
                  className="line-height-body-3 margin-bottom-4"
                  definition="85%"
                />
              </>
            )}
            <DescriptionTerm
              term={t('singleSystem.systemDetails.workCompleted')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .devCompletionPercent
              )}
            />
          </Grid>
          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('singleSystem.systemDetails.releaseFrequency')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .deploymentFrequency
              )}
            />
            {flags.systemProfileHiddenFields && (
              <>
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.retirement')}
                />
                <DescriptionDefinition
                  className="line-height-body-3 margin-bottom-4"
                  definition="No planned retirement or replacement"
                />
              </>
            )}
          </Grid>
          <Grid desktop={{ col: 12 }}>
            <DescriptionTerm
              term={t('singleSystem.systemDetails.developmentDescription')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .devWorkDescription
              )}
            />
          </Grid>
          {flags.systemProfileHiddenFields && (
            <>
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
                <h3 className="margin-top-0 margin-bottom-1">
                  {t('singleSystem.systemDetails.technologyTypes')}
                </h3>
                {/* TODO: Map and populate tags with CEDAR */}
                <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                  Natural Language Processing
                </Tag>
                <Tag className="system-profile__tag text-base-darker bg-base-lighter">
                  Chat Bots
                </Tag>
              </Grid>
            </>
          )}
        </Grid>
      </SectionWrapper>

      {flags.systemProfileHiddenFields && (
        <SectionWrapper borderBottom={isMobile} className="margin-bottom-5">
          <h2 className="margin-top-3 margin-bottom-1">
            {t('singleSystem.systemDetails.ipInfo')}
          </h2>

          {/* TODO: Map defined CEDAR variable once availabe */}
          <Tag className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter">
            <IconCheckCircle className="system-profile__icon text-primary-dark margin-right-1" />
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
      )}
    </>
  );
};

export default SystemDetails;
