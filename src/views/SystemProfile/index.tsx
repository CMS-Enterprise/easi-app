import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, NavLink, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconBookmark,
  IconExpandMore,
  Link,
  SideNav,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { subDays } from 'date-fns';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { startCase } from 'lodash';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import { BUSINESS_OWNER } from 'constants/cedarSystemRoleIds';
import useCheckResponsiveScreen from 'hooks/checkMobile';
// import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import GetSystemProfileQuery from 'queries/GetSystemProfileQuery';
// import {
//   GetCedarSystem
//   // GetCedarSystem_cedarSystem as CedarSystem
// } from 'queries/types/GetCedarSystem';
import {
  GetSystemProfile,
  // eslint-disable-next-line camelcase
  GetSystemProfile_cedarSystemDetails_roles,
  GetSystemProfileVariables
} from 'queries/types/GetSystemProfile';
// eslint-disable-next-line camelcase
import { GetSystemProfileAto_cedarAuthorityToOperate } from 'queries/types/GetSystemProfileAto';
import { CedarAssigneeType } from 'types/graphql-global-types';
import NotFound from 'views/NotFound';
import {
  activities,
  budgetsInfo,
  developmentTags,
  // locationsInfo,
  products,
  subSystems,
  systemData,
  tempCedarSystemProps,
  UrlLocation,
  UrlLocationTag
} from 'views/Sandbox/mockSystemData';

// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems, { showVal } from './components/index';
import SystemSubNav from './components/SystemSubNav/index';

import './index.scss';

export function formatDate(v: string) {
  return DateTime.fromISO(v).toLocaleString(DateTime.DATE_FULL);
}

const ATO_STATUS_DUE_SOON_SUBTRACT_DAYS = 90;

type AtoStatus = 'Active' | 'Due Soon' | 'In Progress' | 'Expired' | 'No ATO';

export function showAtoExpirationDate(
  // eslint-disable-next-line camelcase
  ato?: GetSystemProfileAto_cedarAuthorityToOperate
): React.ReactNode {
  return showVal(
    ato?.dateAuthorizationMemoExpires &&
      formatDate(ato.dateAuthorizationMemoExpires)
  );
}

/**
 * Get a person's full name from a Cedar Role.
 * Format the name in title case if the full name is in all caps.
 */
export function showPersonFullName(
  // eslint-disable-next-line camelcase
  role: GetSystemProfile_cedarSystemDetails_roles
): string {
  const fullname = `${role.assigneeFirstName} ${role.assigneeLastName}`;
  return fullname === fullname.toUpperCase()
    ? startCase(fullname.toLowerCase())
    : fullname;
}

const SystemProfile = () => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const { systemId, subinfo, top } = useParams<{
    subinfo: string;
    systemId: string;
    top: string;
  }>();

  // Scroll to top if redirect
  useLayoutEffect(() => {
    if (top) {
      window.scrollTo(0, 0);
    }
  }, [top]);

  const { loading, error, data } = useQuery<
    GetSystemProfile,
    GetSystemProfileVariables
  >(GetSystemProfileQuery, {
    variables: {
      cedarSystemId: systemId
    }
  });

  const descriptionRef = React.createRef<HTMLElement>();
  const [
    isDescriptionExpandable,
    setIsDescriptionExpandable
  ] = useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(
    false
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  });

  const cmsComponent = useMemo(
    () => data?.cedarSystemDetails?.cedarSystem.businessOwnerOrg,
    [data]
  );

  // Business Owner
  // Select the first found Business Owner
  const businessOwner = useMemo(
    () =>
      data?.cedarSystemDetails?.roles.find(
        role =>
          role.assigneeType === CedarAssigneeType.PERSON &&
          role.roleTypeID === BUSINESS_OWNER
      ),
    [data]
  );

  // Point of Contact is the business owner for now
  // Contextualized poc will be determined later
  const pointOfContact = businessOwner;

  const systemDetails = data?.cedarSystemDetails;

  // Url locations
  const locations: UrlLocation[] | undefined = useMemo(() => {
    /*
    if (systemDetails?.deployments) {
      // eslint-disable-next-line no-console
      console.log('deployments', systemDetails?.deployments);
    }
    */
    return systemDetails?.urls.map(url => {
      // Find a deployment from matching its type with the url host env
      const hostenv = url.urlHostingEnv;
      const deployment = systemDetails.deployments.filter(
        dpl => dpl.deploymentType?.toLowerCase() === hostenv?.toLowerCase()
      );
      // eslint-disable-next-line no-console
      /*
      console.log(
        'location',
        'hostenv:',
        hostenv,
        'url:',
        url,
        'deployment match:',
        deployment
      );
      */

      const tags: UrlLocationTag[] = [];
      if (url.isAPIEndpoint) tags.push('API endpoint');
      if (url.isVersionCodeRepository) tags.push('Versioned code respository');

      const provider: UrlLocation['provider'] = deployment[0]?.dataCenter?.name;
      // eslint-disable-next-line no-console
      // console.log('provider:', provider);

      return {
        ...url,
        environment: deployment[0]?.deploymentType,
        tags,
        provider
      };
    });
  }, [systemDetails]);

  const ato = data?.cedarAuthorityToOperate[0];

  // Ato Status
  // `ato.dateAuthorizationMemoExpires` will be null if tlcPhase is Initiate|Develop
  const atoStatus = useMemo<AtoStatus>(() => {
    // No ato if it doesn't exist
    if (!ato) return 'No ATO';

    // return 'In Progress'; // tbd

    const expiry = ato!.dateAuthorizationMemoExpires;
    if (!expiry) return 'No ATO';

    const date = new Date().toISOString();
    // console.log(date, expiry);

    if (date >= expiry) return 'Expired';
    if (
      date >= subDays(expiry, ATO_STATUS_DUE_SOON_SUBTRACT_DAYS).toISOString()
    )
      return 'Due Soon';
    return 'Active';
  }, [ato]);

  const {
    numberOfContractorFte,
    numberOfFederalFte,
    numberOfFte
  } = useMemo(() => {
    if (data) {
      // eslint-disable-next-line no-shadow
      const numberOfContractorFte = parseInt(
        data?.cedarSystemDetails?.businessOwnerInformation
          ?.numberOfContractorFte ?? '0',
        10
      );
      // eslint-disable-next-line no-shadow
      const numberOfFederalFte = parseInt(
        data?.cedarSystemDetails?.businessOwnerInformation
          ?.numberOfFederalFte ?? '0',
        10
      );
      // eslint-disable-next-line no-shadow
      const numberOfFte = numberOfContractorFte + numberOfFederalFte;
      return { numberOfContractorFte, numberOfFederalFte, numberOfFte };
    }
    return {};
  }, [data]);

  useEffect(() => {
    if (!data) return;
    /* eslint-disable no-console */
    console.group('system profile parent');
    console.log('urls');
    console.table(data?.cedarSystemDetails?.urls);
    console.log('roles');
    console.table(data?.cedarSystemDetails?.roles);
    console.log('cmsComponent', cmsComponent);
    console.log('businessOwner', businessOwner);
    console.log('pointOfContact', pointOfContact);
    console.log('ato:', ato, 'atoStatus:', atoStatus);
    console.log(
      'numberOfContractorFte',
      numberOfContractorFte,
      'numberOfFederalFte',
      numberOfFederalFte,
      'numberOfFte',
      numberOfFte
    );
    console.groupEnd();
    /* eslint-enable no-console */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const cedarData = (data?.cedarSystem ?? null) as tempCedarSystemProps; // Temp props for locations

  // Mocking additional location info on payload until CEDAR location type is defined
  const systemInfo = {
    ...cedarData,
    id: data?.cedarSystemDetails?.cedarSystem.id as string,
    // locations: locationsInfo,
    developmentTags,
    budgets: budgetsInfo,
    subSystems,
    activities,
    // atoStatus: 'In Progress',
    products,
    systemData,
    //
    ato,
    atoStatus,
    locations,
    numberOfContractorFte,
    numberOfFederalFte,
    numberOfFte
  };

  const subComponents = sideNavItems(
    systemInfo,
    flags.systemProfileHiddenFields
  );

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => (
      <NavLink
        to={subComponents[key].route}
        key={key}
        activeClassName="usa-current"
        className={classnames({
          'nav-group-border': subComponents[key].groupEnd
        })}
      >
        {t(`navigation.${key}`)}
      </NavLink>
    )
  );

  if (loading) {
    return <PageLoading />;
  }

  // TODO: Handle errors and loading
  if (error || !systemInfo || (subinfo && !subComponents)) {
    return <NotFound />;
  }

  const subComponent = subComponents[subinfo || 'home'];

  return (
    <MainContent>
      <div id="system-profile">
        <SummaryBox
          heading=""
          className="padding-0 border-0 bg-primary-lighter"
        >
          <div className="padding-top-3 padding-bottom-3 margin-top-neg-1 height-full">
            <Grid className="grid-container">
              <BreadcrumbBar
                variant="wrap"
                className="bg-transparent padding-0"
              >
                <Breadcrumb>
                  <span>&larr; </span>
                  <BreadcrumbLink asCustom={RouterLink} to="/systems">
                    <span>{t('singleSystem.summary.back')}</span>
                  </BreadcrumbLink>
                </Breadcrumb>
              </BreadcrumbBar>

              <PageHeading className="margin-top-2">
                <IconBookmark size={4} className="text-primary" />{' '}
                <span>{data!.cedarSystemDetails!.cedarSystem.name} </span>
                <span className="text-normal font-body-sm">
                  ({data!.cedarSystemDetails!.cedarSystem.acronym})
                </span>
                <div className="text-normal font-body-md">
                  <CollapsableLink
                    className="margin-top-3"
                    eyeIcon
                    startOpen
                    labelPosition="bottom"
                    closeLabel={t('singleSystem.summary.hide')}
                    styleLeftBar={false}
                    id={t('singleSystem.id')}
                    label={t('singleSystem.summary.expand')}
                  >
                    <div
                      className={classnames(
                        'description-truncated',
                        'margin-bottom-2',
                        {
                          expanded: descriptionExpanded
                        }
                      )}
                    >
                      <DescriptionDefinition
                        definition={
                          data!.cedarSystemDetails!.cedarSystem.description
                        }
                        ref={descriptionRef}
                        className="font-body-lg line-height-body-5 text-light"
                      />
                      {isDescriptionExpandable && (
                        <div>
                          <Button
                            unstyled
                            type="button"
                            className="margin-top-1"
                            onClick={() => {
                              setDescriptionExpanded(!descriptionExpanded);
                            }}
                          >
                            {t(
                              descriptionExpanded
                                ? 'singleSystem.description.less'
                                : 'singleSystem.description.more'
                            )}
                            <IconExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <UswdsReactLink
                      aria-label={t('singleSystem.summary.label')}
                      className="line-height-body-5"
                      to="/" // TODO: Get link from CEDAR?
                      variant="external"
                      target="_blank"
                    >
                      {t('singleSystem.summary.view')}{' '}
                      {data!.cedarSystemDetails!.cedarSystem.name}
                      <span aria-hidden>&nbsp;</span>
                    </UswdsReactLink>
                    <Grid row className="margin-top-3">
                      {cmsComponent && (
                        <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                          <DescriptionDefinition
                            definition={t('singleSystem.summary.subheader1')}
                          />
                          <DescriptionTerm
                            className="font-body-md"
                            term={cmsComponent}
                          />
                        </Grid>
                      )}
                      {businessOwner && (
                        <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                          <DescriptionDefinition
                            definition={t('singleSystem.summary.subheader2')}
                          />
                          <DescriptionTerm
                            className="font-body-md"
                            term={showPersonFullName(businessOwner)}
                          />
                        </Grid>
                      )}
                      {flags.systemProfileHiddenFields && (
                        <>
                          {/* Go live date */}
                          <Grid
                            desktop={{ col: 6 }}
                            className="margin-bottom-2"
                          >
                            <DescriptionDefinition
                              definition={t('singleSystem.summary.subheader3')}
                            />
                            <DescriptionTerm
                              className="font-body-md"
                              term="July 27, 2015"
                            />
                          </Grid>
                          {/* Most recent major change */}
                          <Grid
                            desktop={{ col: 6 }}
                            className="margin-bottom-2"
                          >
                            <DescriptionDefinition
                              definition={t('singleSystem.summary.subheader4')}
                            />
                            <DescriptionTerm
                              className="font-body-md"
                              term="December 4, 2021"
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CollapsableLink>
                </div>
              </PageHeading>
            </Grid>
          </div>
        </SummaryBox>

        <SystemSubNav
          subinfo={subinfo}
          systemInfo={systemInfo}
          systemProfileHiddenFields={flags.systemProfileHiddenFields}
        />

        <SectionWrapper className="margin-top-5 margin-bottom-5">
          <GridContainer>
            <Grid row gap>
              {!isMobile && (
                <Grid
                  desktop={{ col: 3 }}
                  className="padding-right-4 sticky-nav"
                >
                  {/* Side navigation for single system */}
                  <SideNav items={subNavigationLinks} />
                </Grid>
              )}

              <Grid desktop={{ col: 9 }}>
                <div id={subComponent.componentId ?? ''}>
                  <GridContainer className="padding-left-0 padding-right-0">
                    <Grid row gap>
                      {/* Central component */}
                      <Grid desktop={{ col: 8 }}>{subComponent.component}</Grid>

                      {/* Contact info sidebar */}
                      <Grid
                        desktop={{ col: 4 }}
                        className={classnames({
                          'sticky-nav': !isMobile
                        })}
                      >
                        {/* Setting a ref here to reference the grid width for the fixed side nav */}
                        {pointOfContact && (
                          <div className="side-divider">
                            <div className="top-divider" />
                            <p className="font-body-xs margin-top-1 margin-bottom-3">
                              {t('singleSystem.pointOfContact')}
                            </p>
                            <h3 className="system-profile__subheader margin-bottom-1">
                              {showPersonFullName(pointOfContact)}
                            </h3>
                            {pointOfContact.roleTypeName && (
                              <DescriptionDefinition
                                definition={pointOfContact.roleTypeName}
                              />
                            )}
                            {pointOfContact.assigneeEmail && (
                              <p>
                                <Link
                                  aria-label={t('singleSystem.sendEmail')}
                                  className="line-height-body-5"
                                  href={pointOfContact.assigneeEmail}
                                  variant="external"
                                  target="_blank"
                                >
                                  {t('singleSystem.sendEmail')}
                                  <span aria-hidden>&nbsp;</span>
                                </Link>
                              </p>
                            )}
                            <p>
                              <UswdsReactLink
                                aria-label={t('singleSystem.moreContact')}
                                className="line-height-body-5"
                                to={`/systems/${systemId}/team-and-contract`}
                                target="_blank"
                              >
                                {t('singleSystem.moreContact')}
                                <span aria-hidden>&nbsp;</span>
                                <span aria-hidden>&rarr; </span>
                              </UswdsReactLink>
                            </p>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              </Grid>
            </Grid>
          </GridContainer>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
