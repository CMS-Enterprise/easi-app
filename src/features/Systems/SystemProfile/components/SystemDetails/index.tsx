import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  Icon,
  Link
} from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import SectionWrapper from 'components/SectionWrapper';
import Tag from 'components/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import formatNumber from 'utils/formatNumber';
import showVal, { showSystemVal } from 'utils/showVal';

import './index.scss';

const SystemDetails = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();
  const { locations, developmentTags, cedarSystemDetails } = system;

  const locationsCountCap = 5;
  const [isLocationsExpanded, setLocationsExpanded] = useState<boolean>(false);
  const showMoreLocationsToggle = locations
    ? locations.length - locationsCountCap > 0
    : false;

  return (
    <>
      <SectionWrapper borderBottom className="padding-bottom-4">
        <h2 id="basic" className="margin-top-0 margin-bottom-4">
          {t('singleSystem.systemDetails.header')}
        </h2>

        <Grid row className="margin-top-3">
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm term={t('singleSystem.systemDetails.ownership')} />
            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(
                cedarSystemDetails?.businessOwnerInformation.isCmsOwned,
                {
                  format: v =>
                    t(
                      `singleSystem.systemDetails.ownershipValues.${
                        v ? 'cmsOwned' : 'contractorOwned'
                      }`
                    )
                }
              )}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              term={t('singleSystem.systemDetails.usersPerMonth')}
            />
            <DescriptionDefinition
              className="line-height-body-3 font-body-md"
              definition={showSystemVal(
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
              definition={showSystemVal(
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
        <h2 id="urls" className="margin-top-3">
          {t('singleSystem.systemDetails.urlsAndLocations')}
        </h2>

        {flags.systemProfileHiddenFields && (
          <>
            <DescriptionTerm
              term={t('singleSystem.systemDetails.migrationDate')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition="December 12, 2017"
              // definition={t('singleSystem.systemDetails.noMigrationDate')}
            />
          </>
        )}

        {locations?.length ? (
          <>
            <CardGroup className="margin-0">
              {locations
                .slice(0, isLocationsExpanded ? undefined : locationsCountCap)
                .map(location => (
                  <Card
                    key={location.id}
                    data-testid="system-card"
                    className="grid-col-12"
                  >
                    <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                      {showVal(
                        location.urlHostingEnv
                          ? t<string>(
                              'singleSystem.systemDetails.environment',
                              { environment: location.urlHostingEnv }
                            )
                          : undefined,
                        {
                          defaultVal: t<string>(
                            'singleSystem.systemDetails.noEnvironmentListed'
                          )
                        }
                      )}
                    </CardHeader>
                    <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                      <h3 className="link-header margin-y-0">
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
                          <span className="text-italic text-normal text-base margin-left-0">
                            {t('singleSystem.systemDetails.noUrlListed')}
                          </span>
                        )}
                      </h3>
                      {location.isBehindWebApplicationFirewall && (
                        <div className="margin-top-1">
                          <Icon.VerifiedUser
                            width="1rem"
                            color="#00a91c"
                            height="1rem"
                            className="margin-right-1"
                            aria-label="verified"
                          />
                          <span className="text-tbottom text-base-dark line-height-body-3">
                            {t(
                              'singleSystem.systemDetails.webApplicationFirewall'
                            )}
                          </span>
                        </div>
                      )}
                      <div className="margin-top-2">
                        {location.tags.map((tag: string) => (
                          <Tag
                            key={tag}
                            className="system-profile__tag margin-bottom-2 text-base-darker bg-base-lighter"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
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
                              definition={showSystemVal(
                                location.deploymentDataCenterName
                              )}
                            />
                          </Grid>
                        </Grid>
                      </CardFooter>
                    )}
                  </Card>
                ))}
            </CardGroup>
            {showMoreLocationsToggle && (
              <Button
                unstyled
                type="button"
                className="line-height-body-5"
                onClick={() => {
                  setLocationsExpanded(!isLocationsExpanded);
                }}
              >
                {t(
                  `singleSystem.systemDetails.showUrls.${
                    isLocationsExpanded ? 'less' : 'more'
                  }`
                )}
                <Icon.ExpandMore
                  className="margin-left-05 margin-bottom-2px text-tbottom"
                  style={{
                    transform: isLocationsExpanded ? 'rotate(180deg)' : ''
                  }}
                />
              </Button>
            )}
          </>
        ) : (
          <Alert type="info" className="margin-bottom-2">
            {t('singleSystem.systemDetails.noURL')}
          </Alert>
        )}
      </SectionWrapper>

      <SectionWrapper
        borderBottom
        className={
          flags.systemProfileHiddenFields
            ? 'padding-bottom-5 margin-bottom-4'
            : 'margin-bottom-5'
        }
      >
        <h2 id="development" className="margin-top-4 margin-bottom-1">
          {t('singleSystem.systemDetails.development')}
        </h2>

        {developmentTags?.map((tag: string) => (
          <Tag
            key={tag}
            className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter"
          >
            <Icon.CheckCircle className="system-profile__icon text-primary-dark margin-right-1" />
            {tag}
          </Tag>
        ))}

        <Grid row className="margin-top-3">
          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('singleSystem.systemDetails.customDevelopment')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .systemCustomization
              )}
            />
            <DescriptionTerm
              term={t('singleSystem.systemDetails.releaseFrequency')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .deploymentFrequency
              )}
            />
          </Grid>
          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('singleSystem.systemDetails.workCompleted')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .devCompletionPercent
              )}
            />
            <DescriptionTerm
              term={t('singleSystem.systemDetails.retirement')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={system.plannedRetirement}
            />
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

      <SectionWrapper borderBottom={isMobile} className="margin-bottom-5">
        <h2 id="ip" className="margin-top-3 margin-bottom-1">
          {t('singleSystem.systemDetails.ipInfo')}
        </h2>

        {cedarSystemDetails?.systemMaintainerInformation.ecapParticipation && (
          <Tag className="system-profile__tag margin-bottom-2 text-primary-dark bg-primary-lighter">
            <Icon.CheckCircle className="system-profile__icon text-primary-dark margin-right-1" />
            {t('singleSystem.systemDetails.eCapInitiative')}
          </Tag>
        )}

        <Grid row className="margin-top-2">
          <Grid desktop={{ col: 6 }} className="padding-right-2">
            <DescriptionTerm term={t('singleSystem.systemDetails.currentIP')} />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .frontendAccessType
              )}
            />
            <DescriptionTerm
              term={t('singleSystem.systemDetails.ipv6Transition')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .ip6TransitionPlan
              )}
            />
          </Grid>
          <Grid desktop={{ col: 6 }} className="padding-right-2">
            <DescriptionTerm term={t('singleSystem.systemDetails.ipAssets')} />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .ipEnabledAssetCount
              )}
            />
            <DescriptionTerm
              term={t('singleSystem.systemDetails.percentTransitioned')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .ip6EnabledAssetPercent
              )}
            />
          </Grid>
          <Grid desktop={{ col: 6 }} className="padding-right-2">
            <DescriptionTerm
              term={t('singleSystem.systemDetails.hardCodedIP')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-4"
              definition={showSystemVal(
                cedarSystemDetails?.systemMaintainerInformation
                  .hardCodedIPAddress,
                {
                  format: v =>
                    v ? 'This system has hard-coded IP addresses' : 'None'
                }
              )}
            />
          </Grid>
        </Grid>
      </SectionWrapper>
    </>
  );
};

export default SystemDetails;
