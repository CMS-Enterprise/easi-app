import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import { useFlags } from 'launchdarkly-react-client-sdk';

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
import useCheckResponsiveScreen from 'hooks/checkMobile';
import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import {
  GetCedarSystem
  // GetCedarSystem_cedarSystem as CedarSystem
} from 'queries/types/GetCedarSystem';
import NotFound from 'views/NotFound';
import {
  activities,
  budgetsInfo,
  developmentTags,
  locationsInfo,
  products,
  subSystems,
  systemData,
  tempCedarSystemProps
} from 'views/Sandbox/mockSystemData';

// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems from './components/index';
import SystemSubNav from './components/SystemSubNav/index';

import './index.scss';

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

  const { loading, error, data } = useQuery<GetCedarSystem>(
    GetCedarSystemQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const cedarData = (data?.cedarSystem ?? null) as tempCedarSystemProps; // Temp props for locations

  // Mocking additional location info on payload until CEDAR location type is defined
  const systemInfo = {
    ...cedarData,
    locations: locationsInfo,
    developmentTags,
    budgets: budgetsInfo,
    subSystems,
    activities,
    atoStatus: 'In Progress',
    products,
    systemData
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
                <span>{systemInfo.name} </span>
                <span className="text-normal font-body-sm">
                  ({systemInfo.acronym})
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
                        definition={systemInfo.description}
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
                      {t('singleSystem.summary.view')} {systemInfo.name}
                      <span aria-hidden>&nbsp;</span>
                    </UswdsReactLink>

                    {/* TODO: Map <DescriptionTerm /> to CEDAR data */}
                    <Grid row className="margin-top-3">
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader1')}
                        />
                        <DescriptionTerm
                          className="font-body-md"
                          term={systemInfo.businessOwnerOrg || ''}
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader2')}
                        />
                        <DescriptionTerm
                          className="font-body-md"
                          term="Geraldine Hobbs"
                        />
                      </Grid>
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
                        <div className="side-divider">
                          <div className="top-divider" />
                          <p className="font-body-xs margin-top-1 margin-bottom-3">
                            {t('singleSystem.pointOfContact')}
                          </p>
                          <h3 className="system-profile__subheader margin-bottom-1">
                            Geraldine Hobbs {/* TODO: Get from CEDAR */}
                          </h3>
                          <DescriptionDefinition
                            definition={t('singleSystem.summary.subheader2')}
                          />
                          <p>
                            <Link
                              aria-label={t('singleSystem.sendEmail')}
                              className="line-height-body-5"
                              href="/" // TODO: Get link from CEDAR?
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
                              href="/" // TODO: Get link from CEDAR?
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
              </Grid>
            </Grid>
          </GridContainer>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
