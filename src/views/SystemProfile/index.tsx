import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  SideNav,
  SummaryBox
} from '@trussworks/react-uswds';

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
// import SystemProfileHealthCard from 'components/SystemProfileHealthCard';
import NotFound from 'views/NotFound';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import SystemHome from './components/systemHome';

import './index.scss';

type componentProps = {
  label: string;
  component: React.ReactNode;
  route: string;
};

const sideNavItems = (id: string) => [
  {
    label: 'home',
    component: <SystemHome />,
    route: `/system-profile/${id}`
  },
  {
    label: 'details',
    component: <SystemHome />,
    route: `/system-profile/${id}/details`
  },
  {
    label: 'team-and-contract',
    component: <SystemHome />,
    route: `/system-profile/${id}/team-and-contract`
  }
];

// Locates the correct component to display in sub-navigation based on url id and parameter
const displaySystemComponent = (label: string, id: string) =>
  sideNavItems(id).find((item: componentProps) => item.label === label)
    ?.component || 'Not Found'; // TODO: Create a not found component that doesnt render entire app like <NotFound />

const SystemProfile = () => {
  const { t } = useTranslation('systemProfile');
  const { systemId, subinfo } = useParams<{
    systemId: string;
    subinfo: string;
  }>();

  // TODO: Use GQL query for single system of CEDAR data
  const systemInfo = mockSystemInfo.find(
    mockSystem => mockSystem.id === systemId
  );

  if (systemInfo === undefined) {
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
                  <span>Back to All Systems</span>
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
        <SectionWrapper className="margin-top-5 margin-bottom-5">
          <Grid className="grid-container">
            <Grid row>
              <Grid desktop={{ col: 3 }}>
                <SideNav
                  items={sideNavItems(systemInfo.id).map(item => (
                    <NavLink
                      to={item.route}
                      activeClassName="usa-current"
                      exact
                    >
                      {t(`navigation.${item.label}`)}
                    </NavLink>
                  ))}
                />
              </Grid>
              <Grid
                desktop={{ col: 6 }}
                className="padding-left-5 padding-right-5"
              >
                {displaySystemComponent(subinfo || 'home', systemInfo.id)}
              </Grid>
              <Grid desktop={{ col: 3 }} />
            </Grid>
          </Grid>
        </SectionWrapper>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemProfile;
