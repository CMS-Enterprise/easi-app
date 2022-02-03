import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  PrimaryNav,
  SideNav,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import { NavContext } from 'components/Header/navContext';
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
import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import {
  GetCedarSystem
  // GetCedarSystem_cedarSystem as CedarSystem
} from 'queries/types/GetCedarSystem';
import useCheckResponsiveScreen from 'utils/checkMobile';
import NotFound from 'views/NotFound';
import {
  developmentTags,
  locationsInfo,
  tempCedarSystemProps
} from 'views/Sandbox/mockSystemData';

// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems from './components/index';

import './index.scss';

const SystemProfile = () => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isMobileSubNavExpanded, setisMobileSubNavExpanded] = useState(false);
  const { setIsMobileSideNavExpanded } = useContext(NavContext);
  const [fixedPosition, setFixedPosition] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [topScrollHeight, setTopScrollHeight] = useState<number | null>(null);
  const mobileSideNav = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { systemId, subinfo, top } = useParams<{
    systemId: string;
    subinfo: string;
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
    developmentTags
  };

  const mobileSideNavClasses = classnames('usa-nav', 'sidenav-mobile', {
    'is-visible': isMobileSubNavExpanded
  });

  const mainNavigationLink: React.ReactNode[] = [
    <NavLink
      to="/"
      onClick={e => {
        e.preventDefault();
        setisMobileSubNavExpanded(false);
        setIsMobileSideNavExpanded(true);
      }}
      className="system-profile__main-nav-link"
    >
      <span>&uarr;&nbsp;&nbsp;</span>
      <span
        className="text-underline link-header"
        aria-label={t('singleSystem.mainNavigation')}
      >
        {t('singleSystem.mainNavigation')}
      </span>
    </NavLink>
  ];

  const subNavigationLinks: React.ReactNode[] = Object.keys(
    sideNavItems(systemInfo, topScrollHeight)
  ).map((key: string) => (
    <NavLink
      to={sideNavItems(systemInfo, topScrollHeight)[key].route}
      key={key}
      onClick={() => setisMobileSubNavExpanded(false)}
      activeClassName="usa-current"
      className={classnames({
        'nav-group-border': sideNavItems(systemInfo, topScrollHeight)[key]
          .groupEnd
      })}
    >
      {t(`navigation.${key}`)}
    </NavLink>
  ));

  const navigationLinks = mainNavigationLink.concat(subNavigationLinks);

  // Handler for detecting clicks outside of the expanded mobile nav
  const handleClick = (e: Event) => {
    if (mobileSideNav.current?.contains(e.target as HTMLElement)) {
      return;
    }
    setisMobileSubNavExpanded(false);
  };

  // Hook for attaching click handle listener
  useEffect(() => {
    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, []);

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

  // Hook used for detecting changes in summary box collapse state
  // Changes from consequent offsetTop will determine when sidenav becomes fixed
  useEffect(() => {
    // Detecting the width for sidenav once position becomes fixed
    if (containerRef?.current?.clientWidth) {
      setContainerWidth(containerRef?.current?.clientWidth + 16); // 1rem padding addition
    }

    // Gets the bottom position of the summary box and offset from top of page to determine fixed threshold
    if (topScrollRef?.current) {
      const scrollHeight =
        topScrollRef?.current?.getBoundingClientRect().bottom + 16; // 1rem padding addition
      setTopScrollHeight(scrollHeight);
    }
  }, [loading, isCollapsed]);

  if (loading) {
    return <PageLoading />;
  }

  // TODO: Handle errors and loading
  if (error || !systemInfo) {
    return <NotFound />;
  }

  return (
    <MainContent>
      <div id="system-profile" onScroll={handleScroll}>
        <SummaryBox
          heading=""
          className="system-profile__summary-box padding-0"
        >
          {/* Setting a ref for summary box height - currently <SummaryBox /> component does not accept ref prop */}
          <div
            className="padding-top-3 padding-bottom-3 system-profile__summary-ref"
            ref={topScrollRef}
          >
            <Grid className="grid-container">
              <BreadcrumbBar variant="wrap">
                <Breadcrumb>
                  <span>&larr; </span>
                  <BreadcrumbLink asCustom={Link} to="/system-profile">
                    <span>{t('singleSystem.summary.back')}</span>
                  </BreadcrumbLink>
                </Breadcrumb>
              </BreadcrumbBar>

              <PageHeading className="margin-top-2">
                <BookmarkCardIcon
                  size="sm"
                  className="margin-right-1 system-profile__bookmark"
                />{' '}
                <span>{systemInfo.name} </span>
                <span className="system-profile__acronym">
                  ({systemInfo.acronym})
                </span>
                <div className="system-profile__summary-body">
                  <CollapsableLink
                    className="margin-top-3"
                    eyeIcon
                    parentState={setIsCollapsed}
                    startOpen
                    labelPosition="bottom"
                    closeLabel={t('singleSystem.summary.hide')}
                    styleLeftBar={false}
                    id={t('singleSystem.id')}
                    label={t('singleSystem.summary.expand')}
                  >
                    <DescriptionDefinition
                      definition={systemInfo.description}
                      className="margin-bottom-2"
                    />
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
                          className="system-profile__subheader"
                          term={systemInfo.businessOwnerOrg || ''}
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader2')}
                        />
                        <DescriptionTerm
                          className="system-profile__subheader"
                          term="Geraldine Hobbs"
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader3')}
                        />
                        <DescriptionTerm
                          className="system-profile__subheader"
                          term="July 27, 2015"
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader4')}
                        />
                        <DescriptionTerm
                          className="system-profile__subheader"
                          term="December 4, 2021"
                        />
                      </Grid>
                    </Grid>
                  </CollapsableLink>
                </div>
              </PageHeading>
            </Grid>
          </div>
        </SummaryBox>

        {/* Button/Header to display when mobile/tablet */}
        <div className="grid-container system-profile__nav">
          <div
            className={classnames('usa-overlay', {
              'is-visible': isMobileSubNavExpanded
            })}
          />
          <button
            type="button"
            className="usa-menu-btn easi-header__basic system-profile__nav-button"
            onClick={() => setisMobileSubNavExpanded(true)}
          >
            <h3 className="padding-left-1">{t(`navigation.${subinfo}`)}</h3>
            <span className="fa fa-bars" />
          </button>
        </div>

        <SectionWrapper className="margin-top-5 margin-bottom-5">
          <Grid className="grid-container">
            <Grid row>
              <Grid
                desktop={{ col: 3 }}
                className={classnames('padding-right-2', {
                  'hide-nav': !fixedPosition
                })}
              />
              <Grid
                desktop={{ col: 3 }}
                style={{
                  width:
                    fixedPosition && !isMobile ? `${containerWidth}px` : '25%'
                }}
                className={classnames('padding-right-2', {
                  'fixed-nav': fixedPosition && !isMobile
                })}
              >
                {/* Setting a ref here to reference the grid width for the fixed side nav */}
                <div ref={containerRef} style={{ width: '100%' }} />
                {/* Side navigation for single system */}
                {!isMobile ? (
                  <SideNav items={subNavigationLinks} />
                ) : (
                  <div ref={mobileSideNav} className={mobileSideNavClasses}>
                    {/* Mobile Display */}
                    <PrimaryNav
                      onToggleMobileNav={() => setisMobileSubNavExpanded(false)}
                      mobileExpanded={isMobileSubNavExpanded}
                      aria-label="Side navigation"
                      items={navigationLinks}
                    />
                  </div>
                )}
              </Grid>

              <Grid desktop={{ col: 9 }}>
                {/* This renders the selected sidenav central component */}
                {
                  sideNavItems(systemInfo, topScrollHeight)[subinfo || 'home']
                    .component
                }
              </Grid>
            </Grid>
          </Grid>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
