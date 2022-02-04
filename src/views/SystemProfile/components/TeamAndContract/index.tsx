import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Tag
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
// import classnames from 'classnames';
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

type TeamAndContractProps = {
  className?: string;
  children?: React.ReactNode;
  system: CedarSystemProps;
};

const vendorsData = [
  {
    vendors: ['TechSystems, Inc', 'Massive Dynamic'],
    contractAwardDate: 'March 19, 2021',
    popStartDate: 'March 20, 2021',
    popEndDate: 'March 21, 2021',
    contractNumber: 'GS1234567890BA-987654321',
    technologyFunctions: ['Application', 'Delivery', 'End User'],
    assetsOrServices: ['External Labor']
  }
];

const contactListData = [
  {
    id: '1',
    role: 'Business Owner',
    name: 'Geraldine Hobbs',
    email: 'geraldine.hobbs@cms.hhs.gov',
    org: 'Web and Emerging Technologies Group (WETG)'
  }
];

const pointOfContactData = {
  name: 'Greta May Jones',
  role: 'Contracting Officer’s Representative (COR)',
  email: 'gmj@gmj.gov'
};

const SystemTeamAndContract = ({
  className,
  children,
  system
}: TeamAndContractProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <GridContainer>
      <Grid row gap>
        <Grid desktop={{ col: 9 }}>
          <PageHeading
            headingLevel="h2"
            className="margin-top-0 margin-bottom-4"
          >
            {t('teamAndContract.header.teamAndContract')}
          </PageHeading>
          <GridContainer className="padding-x-0">
            <Grid row>
              <Grid tablet={{ col: true }}>
                <div>
                  <strong>
                    {t('teamAndContract.federalFullTimeEmployees')}
                  </strong>
                </div>
                <div>5</div>
              </Grid>
              <Grid tablet={{ col: true }}>
                <div>
                  <strong>
                    {t('teamAndContract.contractorFullTimeEmployees')}
                  </strong>
                </div>
                <div>6</div>
              </Grid>
            </Grid>
          </GridContainer>
          <Divider className="margin-top-5" />
          <PageHeading headingLevel="h2" className="margin-top-5 margin-top-4">
            {t('teamAndContract.header.contractInformation')}
          </PageHeading>
          <CardGroup>
            {vendorsData.map(vendor => {
              return (
                <Card className="grid-col-12 margin-bottom-2">
                  <CardHeader className="padding-2 padding-bottom-0">
                    <PageHeading headingLevel="h5" className="margin-y-0">
                      {t('teamAndContract.vendors')}
                    </PageHeading>
                    <PageHeading headingLevel="h3" className="margin-y-0">
                      {vendor.vendors.map(name => (
                        <div>{name}</div>
                      ))}
                    </PageHeading>
                    <div>
                      <strong>{t('teamAndContract.contractAwardDate')}</strong>
                    </div>
                    <div>{vendor.contractAwardDate}</div>
                    <Divider className="margin-y-2" />
                    <div />
                  </CardHeader>
                  <CardBody className="padding-2 padding-top-0">
                    <PageHeading headingLevel="h5" className="margin-y-0">
                      {t('teamAndContract.periodOfPerformance')}
                    </PageHeading>
                    <GridContainer className="padding-x-0">
                      <Grid row>
                        <Grid col>
                          <div>
                            <strong>{t('teamAndContract.startDate')}</strong>
                          </div>
                          <div>{vendor.popStartDate}</div>
                        </Grid>
                        <Grid col>
                          <div>
                            <strong>{t('teamAndContract.endDate')}</strong>
                          </div>
                          <div>{vendor.popEndDate}</div>
                        </Grid>
                      </Grid>
                    </GridContainer>
                    <Divider className="margin-y-2" />
                    <PageHeading headingLevel="h5" className="margin-y-0">
                      {t('teamAndContract.contractNumber')}
                    </PageHeading>
                    <PageHeading headingLevel="h3" className="margin-y-0">
                      {vendor.contractNumber}
                    </PageHeading>
                    <PageHeading headingLevel="h5" className="margin-y-0">
                      {t('teamAndContract.technologyFunctions')}
                    </PageHeading>
                    <div>
                      {vendor.technologyFunctions.map(name => (
                        <Tag
                          key={name}
                          className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                        >
                          {name}
                        </Tag>
                      ))}
                    </div>
                    <PageHeading headingLevel="h5" className="margin-y-0">
                      {t('teamAndContract.assetsOrServices')}
                    </PageHeading>
                    <div>
                      {vendor.assetsOrServices.map(name => (
                        <Tag
                          key={name}
                          className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                        >
                          {name}
                        </Tag>
                      ))}
                    </div>
                  </CardBody>
                  <div />
                </Card>
              );
            })}
          </CardGroup>
          <Divider className="margin-top-5" />
          <PageHeading
            headingLevel="h2"
            className="margin-top-5 margin-bottom-4"
          >
            {t('teamAndContract.header.pointsOfContact')}
          </PageHeading>
          <CardGroup>
            {contactListData.map(contact => (
              <Card key={contact.id} className="grid-col-12 margin-bottom-2">
                <CardHeader className="padding-2 padding-bottom-0">
                  <PageHeading headingLevel="h5" className="margin-y-0">
                    {contact.role}
                  </PageHeading>
                  <PageHeading headingLevel="h3" className="margin-y-0">
                    {contact.name}
                  </PageHeading>
                  <div>
                    <UswdsReactLink
                      className="line-height-body-5"
                      to={contact.email}
                      variant="external"
                      target="_blank"
                    >
                      {contact.email}
                    </UswdsReactLink>
                  </div>
                  <Divider className="margin-y-2" />
                  <div />
                </CardHeader>
                <CardBody className="padding-2 padding-top-0">
                  {contact.org}
                </CardBody>
                <div />
              </Card>
            ))}
          </CardGroup>
        </Grid>
        <Grid desktop={{ col: 3 }}>
          <PageHeading headingLevel="h5" className="margin-y-0">
            {t('teamAndContract.pointOfContact')}
          </PageHeading>
          <PageHeading headingLevel="h2" className="margin-y-0">
            {pointOfContactData.name}
          </PageHeading>
          <div>{pointOfContactData.role}</div>
          <div>
            <UswdsReactLink
              aria-label={t('teamAndContract.sendAnEmail')}
              className="line-height-body-5"
              to={pointOfContactData.email}
              variant="external"
              target="_blank"
            >
              {t('teamAndContract.sendAnEmail')}
            </UswdsReactLink>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default SystemTeamAndContract;
