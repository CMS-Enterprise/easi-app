import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
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
import useCheckResponsiveScreen from 'hooks/checkMobile';
import useOutsideClick from 'hooks/useOutsideClick';
import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import {
  GetCedarSystem
  // GetCedarSystem_cedarSystem as CedarSystem
} from 'queries/types/GetCedarSystem';
import NotFound from 'views/NotFound';
import {
  budgetsInfo,
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
  const { setIsMobileSideNavExpanded } = useContext(NavContext); // Context provider for allowing subnav to trigger main nav toggle
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isMobileSubNavExpanded, setisMobileSubNavExpanded] = useState<boolean>(
    false
  ); // State for managing sub page side nav toggle
  const mobileSideNav = useRef<HTMLDivElement | null>(null); // Ref for mobile responsiveness

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
    developmentTags,
    budgets: budgetsInfo
  };

  const mobileSideNavClasses = classnames('usa-nav', 'sidenav-mobile', {
    'is-visible': isMobileSubNavExpanded
  });

  // Main navigation link that appears at top of mobile side nav to toggle between main nav
  const mainNavigationLink: React.ReactNode[] = [
    <NavLink
      to="/"
      key="main-sidenav"
      onClick={e => {
        // Toggle between main and sub side navs
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

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(
    sideNavItems(systemInfo)
  ).map((key: string) => (
    <NavLink
      to={sideNavItems(systemInfo)[key].route}
      key={key}
      onClick={() => setisMobileSubNavExpanded(false)}
      activeClassName="usa-current"
      className={classnames({
        'nav-group-border': sideNavItems(systemInfo)[key].groupEnd
      })}
    >
      {t(`navigation.${key}`)}
    </NavLink>
  ));

  const navigationLinks = mainNavigationLink.concat(subNavigationLinks);

  // Custom hook for handling mouse clicks outside of mobile expanded side nav
  useOutsideClick(mobileSideNav, setisMobileSubNavExpanded);

  if (loading) {
    return <PageLoading />;
  }

  // TODO: Handle errors and loading
  if (error || !systemInfo) {
    return <NotFound />;
  }

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
                  <BreadcrumbLink asCustom={Link} to="/system-profile">
                    <span>{t('singleSystem.summary.back')}</span>
                  </BreadcrumbLink>
                </Breadcrumb>
              </BreadcrumbBar>

              <PageHeading className="margin-top-2">
                <BookmarkCardIcon
                  size="sm"
                  className="system-profile__bookmark margin-right-1 text-ttop cursor-initial"
                />{' '}
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
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader3')}
                        />
                        <DescriptionTerm
                          className="font-body-md"
                          term="July 27, 2015"
                        />
                      </Grid>
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          definition={t('singleSystem.summary.subheader4')}
                        />
                        <DescriptionTerm
                          className="font-body-md"
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
        <div className="grid-container padding-0">
          <div
            className={classnames('usa-overlay', {
              'is-visible': isMobileSubNavExpanded
            })}
          />
          <button
            type="button"
            className="usa-menu-btn easi-header__basic width-full flex-align-center"
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
                className={classnames('padding-right-4', {
                  'sticky-nav': !isMobileSubNavExpanded
                })}
              >
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
                {sideNavItems(systemInfo)[subinfo || 'home'].component}
              </Grid>
            </Grid>
          </Grid>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
