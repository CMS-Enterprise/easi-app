import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useParams } from 'react-router-dom';
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
  SideNav,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';

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

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(
    sideNavItems(systemInfo)
  ).map((key: string) => (
    <NavLink
      to={sideNavItems(systemInfo)[key].route}
      key={key}
      activeClassName="usa-current"
      className={classnames({
        'nav-group-border': sideNavItems(systemInfo)[key].groupEnd
      })}
    >
      {t(`navigation.${key}`)}
    </NavLink>
  ));

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
  if (error || !systemInfo || (subinfo && !sideNavItems(systemInfo)[subinfo])) {
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
                  <BreadcrumbLink asCustom={Link} to="/systems">
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
        <SystemSubNav subinfo={subinfo} systemInfo={systemInfo} />
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
                {/* This renders the selected sidenav central component */}
                {sideNavItems(systemInfo)[subinfo || 'home'].component}
              </Grid>
            </Grid>
          </GridContainer>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
