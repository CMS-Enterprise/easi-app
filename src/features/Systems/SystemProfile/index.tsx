import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link as RouterLink,
  NavLink,
  useLocation,
  useParams
} from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  Icon,
  Link,
  SideNav,
  SummaryBox,
  SummaryBoxContent
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import NotFound, { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  activities as mockActivies,
  subSystems as mockSubSystems,
  systemData as mockSystemData
} from 'features/Systems/SystemProfile/data/mockSystemData';
import {
  CedarAssigneeType,
  GetSystemProfileQuery,
  useGetSystemProfileQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { getAtoStatus } from 'components/AtoStatus';
import CollapsableLink from 'components/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/SectionWrapper';
import TLCTag from 'components/TLCTag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import {
  CedarRoleAssigneePerson,
  DevelopmentTag,
  RoleTypeName,
  SubpageKey,
  SystemProfileData,
  UrlLocation,
  UrlLocationTag
} from 'types/systemProfile';
import { formatHttpsUrl } from 'utils/formatUrl';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';
import { showSystemVal } from 'utils/showVal';

import BookmarkButton from '../../../components/BookmarkButton';

import EditPageCallout from './components/EditPageCallout';
// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems from './components/index';
import PointsOfContactSidebar from './components/PointsOfContactSidebar/PointsOfContactSidebar';
import SystemSubNav from './components/SystemSubNav/index';
import EditTeam from './components/Team/Edit';
import { getPersonFullName } from './util';

import './index.scss';

/**
 * Get Development Tags which are derived from various other properties.
 */
function getDevelopmentTags(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): DevelopmentTag[] {
  const tags: DevelopmentTag[] = [];
  if (cedarSystemDetails?.systemMaintainerInformation.agileUsed === true) {
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
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): UrlLocation[] {
  return (cedarSystemDetails?.urls ?? []).map(url => {
    // Find a deployment from matching its type with the url host env
    const { urlHostingEnv } = url;
    const deployment = cedarSystemDetails?.deployments.find(
      dpl => urlHostingEnv && dpl.deploymentType === urlHostingEnv
    );

    // Location tags derived from certain properties
    const tags: UrlLocationTag[] = [];
    if (url.isAPIEndpoint) tags.push('API endpoint');
    if (url.isVersionCodeRepository) tags.push('Versioned code respository');

    // Fix address urls without a protocol
    // and reassign it to the original address property
    const address = url.address && formatHttpsUrl(url.address);

    return {
      ...url,
      address,
      deploymentDataCenterName: deployment?.dataCenter?.name,
      tags
    };
  });
}

function getPlannedRetirement(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): string | null {
  const { plansToRetireReplace, quarterToRetireReplace, yearToRetireReplace } =
    cedarSystemDetails?.systemMaintainerInformation || {};

  // Return null if none of the original properties are truthy
  if (
    !(plansToRetireReplace || quarterToRetireReplace || yearToRetireReplace)
  ) {
    return null;
  }

  // Return a string where all falsy values are empty
  return `${plansToRetireReplace || ''} ${
    quarterToRetireReplace || yearToRetireReplace
      ? `(${`Q${quarterToRetireReplace || ''} ${
          yearToRetireReplace || ''
        }`.trim()})`
      : ''
  }`;
}

/**
 * `SystemProfileData` is a merge of request data and parsed data
 * required by SystemHome and at least one other subpage.
 * It is passed to all SystemProfile subpage components.
 */
export function getSystemProfileData(
  data?: GetSystemProfileQuery
): SystemProfileData | undefined {
  // System profile data is generally unavailable if `data.cedarSystemDetails` is empty
  if (!data) return undefined;

  const {
    cedarSystemDetails,
    cedarSoftwareProducts,
    cedarBudget,
    cedarBudgetSystemCost
  } = data;
  const cedarSystem = cedarSystemDetails?.cedarSystem;

  if (
    !cedarSystemDetails ||
    !cedarSystem ||
    !cedarSoftwareProducts ||
    !cedarBudget ||
    !cedarBudgetSystemCost
  )
    return undefined;

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
    atoStatus: getAtoStatus(
      cedarAuthorityToOperate?.dateAuthorizationMemoExpires
    ),
    budgetSystemCosts: cedarBudgetSystemCost,
    budgets: cedarBudget,
    businessOwners,
    developmentTags: getDevelopmentTags(cedarSystemDetails),
    locations,
    numberOfContractorFte,
    numberOfFederalFte,
    numberOfFte,
    personRoles,
    plannedRetirement: getPlannedRetirement(cedarSystemDetails),
    productionLocation,
    status: cedarSystem.status!,
    toolsAndSoftware: cedarSoftwareProducts || undefined,
    usernamesWithRoles,

    // Remaining mock data stubs
    activities: mockActivies,
    subSystems: mockSubSystems,
    systemData: mockSystemData
  };
}

type SystemProfileProps = {
  id?: string;
  modal?: boolean;
};

const SystemProfile = ({ id, modal }: SystemProfileProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const location = useLocation();
  const params = useParams<{
    subinfo: SubpageKey;
    systemId: string;
    edit?: 'edit';
    top: string;
  }>();

  const { subinfo, top, edit } = params;
  const systemId = id || params.systemId;
  const { hash } = location;

  const [modalSubpage, setModalSubpage] = useState<SubpageKey>('home');

  // Scroll to top if redirect
  useLayoutEffect(() => {
    if (top) {
      window.scrollTo(0, 0);
    }
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView();
      }
    }
  }, [top, hash]);

  const { loading, error, data } = useGetSystemProfileQuery({
    variables: {
      cedarSystemId: systemId
    }
  });

  // Header description expand toggle
  const descriptionRef = React.createRef<HTMLElement>();
  const [isDescriptionExpandable, setIsDescriptionExpandable] =
    useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false);

  // Enable the description toggle if it overflows
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  }, [descriptionRef]);

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
        <SummaryBox className="padding-0 border-0 radius-0 bg-primary-lighter">
          <SummaryBoxContent>
            <div className="padding-top-3 padding-bottom-3 margin-top-neg-1 height-full">
              <Grid
                className={classnames('grid-container', {
                  'maxw-none': modal
                })}
              >
                <div className="display-flex flex-align-center margin-top-neg-05">
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
                  <div className="margin-left-auto" style={{ flexShrink: 0 }}>
                    <BookmarkButton
                      id={cedarSystem.id}
                      isBookmarked={cedarSystem.isBookmarked}
                    />
                  </div>
                </div>

                <PageHeading className="margin-top-1 margin-bottom-0 line-height-heading-2">
                  {cedarSystem.name}
                  <span className="margin-left-05 text-normal font-body-lg">
                    ({cedarSystem.acronym})
                  </span>
                </PageHeading>

                {/* Display TLC Phase */}
                <div className="display-flex">
                  <p className="text-bold margin-right-2">
                    {t('singleSystem.summary.tlcPhase')}
                  </p>
                  <TLCTag
                    tlcPhase={data?.cedarAuthorityToOperate[0]?.tlcPhase}
                  />
                </div>

                {flags.systemWorkspace &&
                  systemProfileData.cedarSystemDetails?.isMySystem && (
                    <div className="margin-top-2 margin-bottom-05">
                      <UswdsReactLink
                        className="text-no-underline"
                        to={`/systems/${systemId}/workspace`}
                      >
                        <span className="text-underline">
                          {t('singleSystem.summary.goToWorkspace')}
                        </span>
                        <span aria-hidden>&nbsp;</span>
                        <span aria-hidden>&rarr; </span>
                      </UswdsReactLink>
                    </div>
                  )}

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
                    bold={false}
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
                      {cedarSystem.description ? (
                        <>
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
                                <Icon.ExpandMore
                                  aria-hidden
                                  className="expand-icon margin-left-05 margin-bottom-2px text-tbottom"
                                />
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-heading-lg line-height-heading-2 text-italic text-base-dark">
                          {t('singleSystem.noDescription')}
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
                    <Grid row className="margin-top-4">
                      {/* CMS component owner */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader1')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(cmsComponent, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                      {/* Business Owner */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader2', {
                            count: businessOwners.length
                          })}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={
                            businessOwners.length
                              ? businessOwners
                                  .map(bo => getPersonFullName(bo))
                                  .join(', ')
                              : showSystemVal(null, {
                                  defaultClassName:
                                    'text-normal text-italic text-base-dark'
                                })
                          }
                        />
                      </Grid>
                      {/* Go live date */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader3')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(null, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                      {/* Most recent major change */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader4')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(null, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                    </Grid>
                  </CollapsableLink>
                </div>
              </Grid>
            </div>
          </SummaryBoxContent>
        </SummaryBox>

        {isMobile && (
          <SystemSubNav
            subinfo={subpageKey}
            system={systemProfileData}
            systemProfileHiddenFields={flags.systemProfileHiddenFields}
            modal={modal}
            setModalSubpage={setModalSubpage}
          />
        )}

        {subinfo !== 'team' && (
          <GridContainer className="margin-bottom-3 margin-top-2">
            <Alert
              type="info"
              isClosable
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
                {subComponent ? (
                  <div
                    id={subComponent.componentId ?? ''}
                    className="scroll-margin-top-5"
                  >
                    <GridContainer className="padding-left-0 padding-right-0">
                      <Grid row gap>
                        {/* Central component */}
                        <Grid
                          desktop={{ col: modal ? 12 : 8 }}
                          className="padding-top-3"
                        >
                          {subComponent.component}
                          <div className="margin-top-6 padding-1 bg-base-lightest">
                            <p className="margin-0">
                              <strong>{t('singleSystem.cmsId')}</strong>
                              {/* Cedar System ID returns UUID with curly braces around it */}
                              {/* the following will remove the curly braces, if not null */}
                              {cedarSystem.id.replace(/[{}]/g, '') ?? (
                                <span className="text-italic text-bold">
                                  {t('singleSystem.noDataAvailable')}
                                </span>
                              )}
                            </p>
                          </div>
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
                ) : (
                  <NotFoundPartial />
                )}
              </Grid>
            </Grid>
          </GridContainer>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
