import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink, NavLink, useParams } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { useQuery } from '@apollo/client';
import {
  Alert,
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
import i18next from 'i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { startCase } from 'lodash';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import { ATO_STATUS_DUE_SOON_DAYS } from 'constants/systemProfile';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import GetSystemProfileQuery from 'queries/GetSystemProfileQuery';
/* eslint-disable camelcase */
import { GetSystemIntake_systemIntake_systems_businessOwnerRoles } from 'queries/types/GetSystemIntake';
import {
  GetSystemProfile,
  /* eslint-disable camelcase */
  GetSystemProfile_cedarAuthorityToOperate,
  GetSystemProfile_cedarSystemDetails,
  GetSystemProfile_cedarSystemDetails_roles,
  /* eslint-enable camelcase */
  GetSystemProfileVariables
} from 'queries/types/GetSystemProfile';
import { CedarAssigneeType } from 'types/graphql-global-types';
import {
  AtoStatus,
  CedarRoleAssigneePerson,
  DevelopmentTag,
  RoleTypeName,
  SubpageKey,
  SystemProfileData,
  UrlLocation,
  UrlLocationTag,
  UsernameWithRoles
} from 'types/systemProfile';
import { formatDateUtc, parseAsUTC } from 'utils/date';
import NotFound from 'views/NotFound';
import {
  activities as mockActivies,
  budgetsInfo as mockBudgets,
  subSystems as mockSubSystems,
  systemData as mockSystemData
} from 'views/SystemProfile/mockSystemData';

import EditPageCallout from './components/EditPageCallout';
// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems from './components/index';
import SystemSubNav from './components/SystemSubNav/index';
import EditTeam from './components/Team/Edit';
import PointsOfContactSidebar from './PointsOfContactSidebar';

import './index.scss';

function httpsUrl(url: string): string {
  if (/^https?/.test(url)) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Get the ATO Status from certain date properties and flags.
 */
export function getAtoStatus(
  // eslint-disable-next-line camelcase
  cedarAuthorityToOperate?: GetSystemProfile_cedarAuthorityToOperate
): AtoStatus {
  // `ato.dateAuthorizationMemoExpires` will be null if tlcPhase is Initiate|Develop

  // No ato if it doesn't exist
  if (!cedarAuthorityToOperate) return 'No ATO';

  // return 'In progress'; // tbd

  const { dateAuthorizationMemoExpires } = cedarAuthorityToOperate;

  if (!dateAuthorizationMemoExpires) return 'No ATO';

  const expiry = parseAsUTC(dateAuthorizationMemoExpires).toString();

  const date = new Date().toISOString();

  if (date >= expiry) return 'Expired';

  const soon = parseAsUTC(expiry)
    .minus({ days: ATO_STATUS_DUE_SOON_DAYS })
    .toString();
  if (date >= soon) return 'Due Soon';

  return 'Active';
}

/**
 * Get Development Tags which are derived from various other properties.
 */
function getDevelopmentTags(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfile_cedarSystemDetails
): DevelopmentTag[] {
  const tags: DevelopmentTag[] = [];
  if (cedarSystemDetails.systemMaintainerInformation.agileUsed === true) {
    tags.push('Agile Methodology');
  }
  return tags;
}

/**
 * Get a list of UrlLocations found from Cedar system Urls and Deployments.
 * A `UrlLocation` is extended from a Cedar Url with some additional parsing
 * and Deployment assignments.
 */
function getLocations(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfile_cedarSystemDetails
): UrlLocation[] {
  return cedarSystemDetails.urls.map(url => {
    // Find a deployment from matching its type with the url host env
    const { urlHostingEnv } = url;
    const deployment = cedarSystemDetails.deployments.find(
      dpl => urlHostingEnv && dpl.deploymentType === urlHostingEnv
    );

    // Location tags derived from certain properties
    const tags: UrlLocationTag[] = [];
    if (url.isAPIEndpoint) tags.push('API endpoint');
    if (url.isVersionCodeRepository) tags.push('Versioned code respository');

    // Fix address urls without a protocol
    // and reassign it to the original address property
    const address = url.address && httpsUrl(url.address);

    return {
      ...url,
      address,
      deploymentDataCenterName: deployment?.dataCenter?.name,
      tags
    };
  });
}

/**
 * Get a person's full name from a Cedar Role.
 * Format the name in title case if the full name is in all caps.
 */
export function getPersonFullName(
  role: // eslint-disable-next-line camelcase
  | GetSystemProfile_cedarSystemDetails_roles
    // eslint-disable-next-line camelcase
    | GetSystemIntake_systemIntake_systems_businessOwnerRoles
): string {
  const fullname = `${role.assigneeFirstName} ${role.assigneeLastName}`;
  return fullname === fullname.toUpperCase()
    ? startCase(fullname.toLowerCase())
    : fullname;
}

/**
 * Get a list of people by their usernames with of a nested list of their Cedar Roles.
 * Assignees appear to be listed in order. The returned list keeps that order.
 */
export function getUsernamesWithRoles(
  personRoles: CedarRoleAssigneePerson[]
): UsernameWithRoles[] {
  const people: UsernameWithRoles[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const role of personRoles) {
    const { assigneeUsername } = role;
    if (assigneeUsername) {
      let person = people.find(
        p => p.assigneeUsername === role.assigneeUsername
      );
      if (!person) {
        person = { assigneeUsername, roles: [] };
        people.push(person);
      }

      person.roles.push(role);
    }
  }

  return people;
}

/**
 * `SystemProfileData` is a merge of request data and parsed data
 * required by SystemHome and at least one other subpage.
 * It is passed to all SystemProfile subpage components.
 */
export function getSystemProfileData(
  data?: GetSystemProfile
): SystemProfileData | undefined {
  // System profile data is generally unavailable if `data.cedarSystemDetails` is empty
  if (!data) return undefined;

  const { cedarSystemDetails, cedarSoftwareProducts } = data;
  const cedarSystem = cedarSystemDetails?.cedarSystem;

  if (!cedarSystemDetails || !cedarSystem) return undefined;

  // Save CedarAssigneeType.PERSON roles for convenience
  const personRoles = cedarSystemDetails.roles.filter(
    role => role.assigneeType === CedarAssigneeType.PERSON
  ) as CedarRoleAssigneePerson[];

  const businessOwners = personRoles.filter(
    role => role.roleTypeName === RoleTypeName.BUSINESS_OWNER
  );

  const usernamesWithRoles = getUsernamesWithRoles(personRoles);

  const locations = getLocations(cedarSystemDetails);

  const productionLocation = locations.find(
    location => location.urlHostingEnv === 'Production'
  );

  const cedarAuthorityToOperate = data.cedarAuthorityToOperate[0];

  const numberOfContractorFte = parseFloat(
    cedarSystemDetails.businessOwnerInformation?.numberOfContractorFte || '0'
  );

  const numberOfFederalFte = parseFloat(
    cedarSystemDetails.businessOwnerInformation?.numberOfFederalFte || '0'
  );

  const numberOfFte = Number(
    (numberOfContractorFte + numberOfFederalFte).toFixed(2)
  );

  return {
    ...data,
    id: cedarSystem.id,
    ato: cedarAuthorityToOperate,
    atoStatus: getAtoStatus(cedarAuthorityToOperate),
    businessOwners,
    developmentTags: getDevelopmentTags(cedarSystemDetails),
    locations,
    numberOfContractorFte,
    numberOfFederalFte,
    numberOfFte,
    personRoles,
    productionLocation,
    status: cedarSystem.status,
    usernamesWithRoles,

    // Remaining mock data stubs
    activities: mockActivies,
    budgets: mockBudgets,
    toolsAndSoftware: cedarSoftwareProducts,
    subSystems: mockSubSystems,
    systemData: mockSystemData
  };
}

export function showAtoExpirationDate(
  // eslint-disable-next-line camelcase
  systemProfileAto?: GetSystemProfile_cedarAuthorityToOperate
): React.ReactNode {
  return showVal(
    systemProfileAto?.dateAuthorizationMemoExpires &&
      formatDateUtc(
        systemProfileAto.dateAuthorizationMemoExpires,
        'MMMM d, yyyy'
      )
  );
}

/**
 * Show the value if it's not `null`, `undefined`, or `''`,
 * otherwise render `defaultVal`.
 * Use a `format` function on the value if provided.
 */
export function showVal(
  val: string | number | null | undefined,
  {
    defaultVal = i18next.t<string>('general:noInfoToDisplay'),
    format
  }: {
    defaultVal?: string;
    format?: (v: any) => string;
  } = {}
): React.ReactNode {
  if (val === null || val === undefined || val === '') {
    return <span className="text-italic text-base">{defaultVal}</span>;
  }

  if (format) return format(val);

  return val;
}

/**
 * Determine whether a particular sub page is editable based on sub page key.
 */
export function subPageIsEditable(componentID: SubpageKey): boolean {
  // TODO: Add sub pages as they become editable (this will remove the temporary edit system profile banner from that sub page)
  const editableComponentIDs: SubpageKey[] = ['home', 'team'];

  if (!editableComponentIDs.includes(componentID)) {
    return true;
  }
  return false;
}

type SystemProfileProps = {
  id?: string;
  modal?: boolean;
};

const SystemProfile = ({ id, modal }: SystemProfileProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const params = useParams<{
    subinfo: SubpageKey;
    systemId: string;
    edit?: 'edit';
    top: string;
  }>();

  const { subinfo, top, edit } = params;
  const systemId = id || params.systemId;

  const [modalSubpage, setModalSubpage] = useState<SubpageKey>('home');

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

  // Header description expand toggle
  const descriptionRef = React.createRef<HTMLElement>();
  const [
    isDescriptionExpandable,
    setIsDescriptionExpandable
  ] = useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(
    false
  );

  // Enable the description toggle if it overflows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  });

  const systemProfileData: SystemProfileData | undefined = useMemo(
    () => getSystemProfileData(data),
    [data]
  );

  const fields = useMemo(() => {
    if (!data) return {};

    const { cedarSystemDetails } = data!;
    if (!cedarSystemDetails) return {};

    return {
      cedarSystem: cedarSystemDetails.cedarSystem,
      cmsComponent: cedarSystemDetails.cedarSystem.businessOwnerOrg
    };
  }, [data]);

  const { cedarSystem, cmsComponent } = fields;

  if (loading) {
    return <PageLoading />;
  }

  if (error || !systemProfileData || !cedarSystem) {
    return <NotFound />;
  }

  const { businessOwners, productionLocation } = systemProfileData;

  const subComponents = sideNavItems(
    systemProfileData,
    flags.systemProfileHiddenFields
  );

  const subpageKey: SubpageKey = subinfo || modalSubpage || 'home';

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => {
      const comp = subComponents[key];
      if (modal)
        return (
          <Button
            key={key}
            className={classnames({
              'nav-group-border': subComponents[key].groupEnd,
              'usa-current': modalSubpage === key
            })}
            type="button"
            onClick={() => setModalSubpage(key as SubpageKey)}
            unstyled
          >
            {t(`navigation.${key}`)}
          </Button>
        );
      return (
        <>
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
          {comp.hashLinks &&
            key === subpageKey &&
            comp.hashLinks.map((sub, subidx) => {
              return (
                <NavHashLink
                  to={sub.hash}
                  key={key + sub.name}
                  className="margin-left-4"
                  activeClassName="text-bold text-primary"
                >
                  {sub.name}
                </NavHashLink>
              );
            })}
        </>
      );
    }
  );

  const subComponent = subComponents[subpageKey];

  if (subinfo === 'team' && edit) {
    return (
      <EditTeam
        name={cedarSystem.name}
        team={systemProfileData.usernamesWithRoles}
        numberOfFederalFte={systemProfileData.numberOfFederalFte}
        numberOfContractorFte={systemProfileData.numberOfContractorFte}
      />
    );
  }

  return (
    <MainContent>
      <div id="system-profile">
        <SummaryBox
          heading=""
          className="padding-0 border-0 radius-0 bg-primary-lighter"
        >
          <div className="padding-top-3 padding-bottom-3 margin-top-neg-1 height-full">
            <Grid
              className={classnames('grid-container', {
                'maxw-none': modal
              })}
            >
              {!modal && (
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
              )}

              <PageHeading className="margin-top-2">
                <IconBookmark size={4} className="text-primary" />{' '}
                <span>{cedarSystem.name} </span>
                <span className="text-normal font-body-sm">
                  ({cedarSystem.acronym})
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
                        definition={cedarSystem.description}
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
                    {productionLocation && productionLocation.address && (
                      <Link
                        aria-label={t('singleSystem.summary.label')}
                        className="line-height-body-5"
                        href={productionLocation.address}
                        variant="external"
                        target="_blank"
                      >
                        {t('singleSystem.summary.view')} {cedarSystem.name}
                        <span aria-hidden>&nbsp;</span>
                      </Link>
                    )}
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
                      {businessOwners.length && (
                        <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                          <DescriptionDefinition
                            definition={t('singleSystem.summary.subheader2', {
                              count: businessOwners.length
                            })}
                          />
                          <DescriptionTerm
                            className="font-body-md"
                            term={businessOwners
                              .map(bo => getPersonFullName(bo))
                              .join(', ')}
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

        {/* Only display temporary edit system profile banner if sub page does not have full edit functionality */}
        {subPageIsEditable(subpageKey) && (
          <GridContainer className="margin-bottom-3 margin-top-2 desktop:margin-bottom-3">
            <Alert
              type="info"
              heading={t('singleSystem.editPage.tempEditBanner.heading')}
            >
              <Trans i18nKey="systemProfile:singleSystem.editPage.tempEditBanner.content">
                indexOne
                <Link href="mailto:EnterpriseArchitecture@cms.hhs.gov">
                  email
                </Link>
                indexTwo
              </Trans>
            </Alert>
          </GridContainer>
        )}

        <SystemSubNav
          subinfo={subpageKey}
          system={systemProfileData}
          systemProfileHiddenFields={flags.systemProfileHiddenFields}
          modal={modal}
          setModalSubpage={setModalSubpage}
        />

        <SectionWrapper className="margin-bottom-5">
          <GridContainer className={classnames({ 'maxw-none': modal })}>
            <Grid row gap>
              {!isMobile && (
                <Grid
                  desktop={{ col: 3 }}
                  className="padding-right-4 sticky side-nav"
                >
                  {/* Side navigation for single system */}
                  <SideNav items={subNavigationLinks} />

                  {subinfo === 'team' && (
                    <EditPageCallout
                      className="margin-top-3"
                      // TODO: Get system modifiedAt value and add to props
                      // modifiedAt={}
                    />
                  )}

                  {/* Setting a ref here to reference the grid width for the fixed side nav */}
                  {modal && (
                    <>
                      <div className="top-divider margin-top-4" />
                      <PointsOfContactSidebar
                        subpageKey={subpageKey}
                        system={systemProfileData}
                        systemId={systemId}
                      />
                    </>
                  )}
                </Grid>
              )}

              <Grid desktop={{ col: 9 }}>
                <div id={subComponent.componentId ?? ''}>
                  <GridContainer className="padding-left-0 padding-right-0">
                    <Grid row gap>
                      {/* Central component */}
                      <Grid
                        desktop={{ col: modal ? 12 : 8 }}
                        className="padding-top-3"
                      >
                        {subComponent.component}
                      </Grid>

                      {/* Contact info sidebar */}
                      {!modal && (
                        <Grid
                          desktop={{ col: 4 }}
                          className={classnames({
                            'sticky side-nav padding-top-7': !isMobile,
                            'margin-top-3': isMobile
                          })}
                        >
                          {/* Setting a ref here to reference the grid width for the fixed side nav */}
                          <div className="side-divider">
                            <div className="top-divider" />
                            <PointsOfContactSidebar
                              subpageKey={subpageKey}
                              system={systemProfileData}
                              systemId={systemId}
                            />
                          </div>
                          {subinfo === 'team' && isMobile && (
                            <EditPageCallout
                              className="margin-top-4"
                              // TODO: Get system modifiedAt value and add to props
                              // modifiedAt={}
                            />
                          )}
                        </Grid>
                      )}
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
