import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useParams } from 'react-router-dom';
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
import Footer from 'components/Footer';
import Header from 'components/Header';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import useCheckResponsiveScreen from 'utils/checkMobile';
import NotFound from 'views/NotFound';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import sideNavItems from './components/index';

import './index.scss';

const SystemProfile = () => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isMobileSideNavExpanded, setIsMobileSideNavExpanded] = useState(false);
  const mobileSideNav = useRef<any>();
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

  // TODO: Use GQL query for single system of CEDAR data
  const systemInfo = mockSystemInfo.find(
    mockSystem => mockSystem.id === systemId
  );

  const mobileSideNavClasses = classnames('usa-nav', 'sidenav-mobile', {
    'is-visible': isMobileSideNavExpanded
  });

  const handleClick = (e: Event) => {
    if (
      mobileSideNav &&
      mobileSideNav.current &&
      mobileSideNav.current.contains(e.target)
    ) {
      return;
    }

    setIsMobileSideNavExpanded(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, []);

  // TODO: Handle errors and loading
  if (!systemInfo) {
    return <NotFound />;
  }

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <SummaryBox heading="" className="system-profile__summary-box">
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
              <div className="bookmark__title">
                <BookmarkCardIcon size="sm" className="margin-right-1" />{' '}
                <span>{systemInfo.name} </span>
                <span className="system-profile__acronym">
                  ({systemInfo.acronym})
                </span>
              </div>
              <div className="system-profile__summary-body">
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

                  {/* TODO: Map fields to CEDAR data */}
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
                        term={systemInfo.businessOwnerOrgComp || ''}
                      />
                    </Grid>
                    <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                      <DescriptionDefinition
                        definition={t('singleSystem.summary.subheader3')}
                      />
                      <DescriptionTerm
                        className="system-profile__subheader"
                        term={systemInfo.systemMaintainerOrg || ''}
                      />
                    </Grid>
                    <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                      <DescriptionDefinition
                        definition={t('singleSystem.summary.subheader4')}
                      />
                      <DescriptionTerm
                        className="system-profile__subheader"
                        term={systemInfo.id || ''}
                      />
                    </Grid>
                  </Grid>
                </CollapsableLink>
              </div>
            </PageHeading>
          </Grid>
        </SummaryBox>

        {/* Button/Header to display when mobile/tablet */}
        <div className="grid-container system-profile__nav">
          <div
            className={classnames('usa-overlay', {
              'is-visible': isMobileSideNavExpanded
            })}
          />
          <button
            type="button"
            className="usa-menu-btn easi-header__basic  system-profile__nav-button"
            onClick={() => setIsMobileSideNavExpanded(true)}
          >
            <h3 className="padding-left-1">{t(`navigation.${subinfo}`)}</h3>
            <span className="fa fa-bars" />
          </button>
        </div>

        <SectionWrapper className="margin-top-5 margin-bottom-5">
          <Grid className="grid-container">
            <Grid row>
              <Grid desktop={{ col: 3 }}>
                {/* Side navigation for single system */}
                {!isMobile ? (
                  <SideNav
                    items={Object.keys(sideNavItems(systemInfo.id)).map(
                      (key: string) => (
                        <NavLink
                          to={sideNavItems(systemInfo.id)[key].route}
                          key={key}
                          activeClassName="usa-current"
                          className={classnames({
                            'nav-group-border': sideNavItems(systemInfo.id)[key]
                              .groupEnd
                          })}
                          exact
                        >
                          {t(`navigation.${key}`)}
                        </NavLink>
                      )
                    )}
                  />
                ) : (
                  <div ref={mobileSideNav} className={mobileSideNavClasses}>
                    {/* Mobile Display */}
                    <PrimaryNav
                      onToggleMobileNav={() =>
                        setIsMobileSideNavExpanded(false)
                      }
                      mobileExpanded={isMobileSideNavExpanded}
                      aria-label="Side navigation"
                      items={Object.keys(sideNavItems(systemInfo.id)).map(
                        (key: string) => (
                          <NavLink
                            to={sideNavItems(systemInfo.id)[key].route}
                            key={key}
                            onClick={() => setIsMobileSideNavExpanded(false)}
                            activeClassName="usa-current"
                            className={classnames({
                              'nav-group-border': sideNavItems(systemInfo.id)[
                                key
                              ].groupEnd
                            })}
                            exact
                          >
                            {t(`navigation.${key}`)}
                          </NavLink>
                        )
                      )}
                    />
                  </div>
                )}
              </Grid>

              <Grid
                desktop={{ col: 6 }}
                className="padding-left-5 padding-right-5"
              >
                {/* This renders the selected sidenav central component */}
                {sideNavItems(systemInfo.id)[subinfo || 'home'].component}
              </Grid>
              {/* Point of contact/ miscellaneous info */}
              <Grid desktop={{ col: 3 }}>
                <div className="top-divider" />
                <p>{t('singleSystem.pointOfContact')}</p>
                <DescriptionTerm
                  className="system-profile__subheader"
                  term={systemInfo.businessOwnerOrgComp || ''}
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
        </SectionWrapper>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemProfile;
