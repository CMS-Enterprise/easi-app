import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Grid, Tag } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

import './index.scss';

type SystemDetailsProps = {
  system: CedarSystemProps;
};

const SystemDetails = ({ system }: SystemDetailsProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <Grid className="grid-container padding-left-0 padding-right-0">
      <Grid row>
        <Grid desktop={{ col: 9 }} className="padding-right-3">
          <SectionWrapper borderBottom className="padding-bottom-5">
            <PageHeading headingLevel="h2" className="margin-top-0">
              {t('singleSystem.systemDetails.header')}
            </PageHeading>

            <Grid row className="margin-top-3">
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.ownership')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.usersPerMonth')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.access')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-5">
                <DescriptionTerm
                  term={t('singleSystem.systemDetails.fismaID')}
                />
                <DescriptionDefinition
                  className="font-body-md"
                  definition={system.businessOwnerOrg || ''}
                />
              </Grid>
            </Grid>

            <PageHeading
              headingLevel="h3"
              className="margin-top-0 margin-bottom-1"
            >
              {t('singleSystem.systemDetails.tagHeader1')}
            </PageHeading>
            <Tag className="system-profile__tag">Fee for Service (FFS)</Tag>

            <PageHeading
              headingLevel="h3"
              className="margin-top-4 margin-bottom-1"
            >
              {t('singleSystem.systemDetails.tagHeader2')}
            </PageHeading>
            <Tag className="system-profile__tag">Next Generation ACO Model</Tag>
          </SectionWrapper>

          <SectionWrapper borderBottom className="padding-bottom-5">
            <PageHeading headingLevel="h2" className="margin-top-3">
              {t('singleSystem.systemDetails.urlsAndLocations')}
            </PageHeading>

            <DescriptionTerm
              term={t('singleSystem.systemDetails.migrationDate')}
            />
            <DescriptionDefinition
              className="font-body-md"
              definition={system.businessOwnerOrg || ''}
            />

            {/* <CardGroup className="margin-top-5"> */}
            <Card
              data-testid="system-card"
              className="grid-col-12 margin-top-5"
            >
              <CardHeader className="easi-header__basic">
                <dt>{t('singleSystem.systemDetails.prodEnv')}</dt>
                <div>
                  <dd>{t('singleSystem.systemDetails.wedAppFirewall')}</dd>
                </div>
              </CardHeader>

              <CardBody>
                <h2 className="link-header margin-top-0 margin-bottom-2">
                  <UswdsReactLink
                    className="system-profile__card-link"
                    to={system.id}
                  >
                    ham.cms.gov
                  </UswdsReactLink>
                </h2>
                <Tag className="system-profile__tag margin-bottom-2">
                  API Endpoint
                </Tag>
                <Divider />
              </CardBody>

              {/* <Grid
                desktop={{ col: 12 }}
                className="padding-left-2 padding-right-2"
              >
                <h2 className="link-header margin-top-0 margin-bottom-2">
                  <UswdsReactLink
                    className="system-profile__card-link"
                    to={system.id}
                  >
                    ham.cms.gov
                  </UswdsReactLink>
                </h2>
                <Tag className="system-profile__tag margin-bottom-2">
                  API Endpoint
                </Tag>
                <Divider />
              </Grid> */}
              <Grid row>
                <Grid desktop={{ col: 6 }} className="padding-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.location')}
                  />
                  <DescriptionDefinition
                    className="font-body-md"
                    definition={system.businessOwnerOrgComp || ''}
                  />
                </Grid>
                <Grid desktop={{ col: 6 }} className="padding-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.cloudProvider')}
                  />
                  <DescriptionDefinition
                    className="font-body-md"
                    definition={system.businessOwnerOrgComp || ''}
                  />
                </Grid>
              </Grid>
            </Card>
            {/* </CardGroup> */}
          </SectionWrapper>
        </Grid>
        {/* Point of contact/ miscellaneous info */}
        <Grid desktop={{ col: 3 }}>
          <div className="top-divider" />
          <p>{t('singleSystem.pointOfContact')}</p>
          <DescriptionTerm
            className="system-profile__subheader"
            term={system.businessOwnerOrgComp || ''}
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
  );
};

export default SystemDetails;
