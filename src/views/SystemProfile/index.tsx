import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
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
// import SystemProfileHealthCard from 'components/SystemProfileHealthCard';
import NotFound from 'views/NotFound';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import './index.scss';

const SystemProfile = () => {
  const { t } = useTranslation('systemProfile');
  const { systemId } = useParams<{ systemId: string }>();

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
                    {t('singleSystem.summary.view')}
                    {systemInfo.name}
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
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemProfile;
