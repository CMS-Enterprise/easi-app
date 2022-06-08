import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  IconMailOutline,
  Link
} from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import GetSystemProfileTeamQuery from 'queries/GetSystemProfileTeamQuery';
import {
  GetSystemProfileTeam,
  GetSystemProfileTeamVariables
} from 'queries/types/GetSystemProfileTeam';
import { CedarAssigneeType } from 'types/graphql-global-types';
import NotFound from 'views/NotFound';
import { showPersonFullName } from 'views/SystemProfile';

import { showVal, SystemProfileSubComponentProps } from '..';

import './index.scss';

const vendorsData = [
  {
    vendors: ['TechSystems, Inc', 'Massive Dynamic'],
    contractAwardDate: 'March 19, 2021',
    popStartDate: 'March 20, 2021',
    popEndDate: 'March 21, 2021',
    contractNumber: 'GS1234567890BA-987654321',
    technologyFunctions: [
      'Application',
      'Delivery',
      'End User',
      'IT Management',
      'Platform',
      'Security & Compliance'
    ],
    assetsOrServices: ['External Labor', 'Software']
  },
  {
    vendors: ['SkyNet'],
    contractAwardDate: 'April 19, 2021',
    popStartDate: 'April 20, 2021',
    popEndDate: 'April 21, 2021',
    contractNumber: 'GS1234567890BA-123456789',
    technologyFunctions: ['Network', 'Storage'],
    assetsOrServices: ['Outside Services']
  }
];

const SystemTeamAndContract = ({ system }: SystemProfileSubComponentProps) => {
  const { t } = useTranslation('systemProfile');
  const flags = useFlags();
  const { loading, error, data } = useQuery<
    GetSystemProfileTeam,
    GetSystemProfileTeamVariables
  >(GetSystemProfileTeamQuery, {
    variables: {
      systemId: system.id
    }
  });

  if (loading) {
    return <PageLoading />;
  }
  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <SectionWrapper borderBottom className="padding-bottom-4">
        <h2 className="margin-top-0 margin-bottom-4">
          {t('singleSystem.teamAndContract.header.teamAndContract')}
        </h2>
        <GridContainer className="padding-x-0">
          <Grid row>
            <Grid tablet={{ col: true }}>
              <DescriptionTerm
                term={t(
                  'singleSystem.teamAndContract.federalFullTimeEmployees'
                )}
              />
              <DescriptionDefinition
                className="font-body-md line-height-body-3"
                definition={showVal(
                  data!.cedarSystemDetails!.businessOwnerInformation
                    .numberOfFederalFte
                )}
              />
            </Grid>
            <Grid tablet={{ col: true }}>
              <DescriptionTerm
                term={t(
                  'singleSystem.teamAndContract.contractorFullTimeEmployees'
                )}
              />
              <DescriptionDefinition
                className="font-body-md line-height-body-3"
                definition={showVal(
                  data!.cedarSystemDetails!.businessOwnerInformation
                    .numberOfContractorFte
                )}
              />
            </Grid>
          </Grid>
        </GridContainer>
      </SectionWrapper>
      {flags.systemProfileHiddenFields && (
        <SectionWrapper borderBottom className="padding-bottom-5">
          <h2 className="margin-top-5 margin-top-4">
            {t('singleSystem.teamAndContract.header.contractInformation')}
          </h2>
          <CardGroup className="margin-0">
            {vendorsData.map(vendor => {
              return (
                <Card className="grid-col-12 margin-bottom-2">
                  <CardHeader className="padding-2 padding-bottom-0">
                    <h5 className="margin-y-0 font-sans-2xs text-normal">
                      {t('singleSystem.teamAndContract.vendors')}
                    </h5>
                    <h3 className="margin-y-0 line-height-body-3">
                      {vendor.vendors.map(name => (
                        <div>{name}</div>
                      ))}
                    </h3>
                    <DescriptionTerm
                      className="padding-top-2"
                      term={t('singleSystem.teamAndContract.contractAwardDate')}
                    />
                    <DescriptionDefinition
                      className="font-body-md line-height-body-3"
                      definition={vendor.contractAwardDate}
                    />
                    <Divider className="margin-y-2" />
                  </CardHeader>
                  <CardBody className="padding-2 padding-top-0">
                    <h5 className="margin-top-2 margin-bottom-1 font-sans-2xs text-normal">
                      {t('singleSystem.teamAndContract.periodOfPerformance')}
                    </h5>
                    <GridContainer className="padding-x-0">
                      <Grid row>
                        <Grid col>
                          <DescriptionTerm
                            term={t('singleSystem.teamAndContract.startDate')}
                          />
                          <DescriptionDefinition
                            className="font-body-md line-height-body-3"
                            definition={vendor.popStartDate}
                          />
                        </Grid>
                        <Grid col>
                          <DescriptionTerm
                            term={t('singleSystem.teamAndContract.endDate')}
                          />
                          <DescriptionDefinition
                            className="font-body-md line-height-body-3"
                            definition={vendor.popEndDate}
                          />
                        </Grid>
                      </Grid>
                    </GridContainer>
                    <Divider className="margin-y-2" />
                    <h5 className="margin-y-0 font-sans-2xs text-normal">
                      {t('singleSystem.teamAndContract.contractNumber')}
                    </h5>
                    <h3 className="margin-y-0">{vendor.contractNumber}</h3>
                    <h5 className="margin-bottom-0 margin-top-2 font-sans-2xs text-normal">
                      {t('singleSystem.teamAndContract.technologyFunctions')}
                    </h5>
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
                    <h5 className="margin-bottom-0 margin-top-2 font-sans-2xs text-normal">
                      {t('singleSystem.teamAndContract.assetsOrServices')}
                    </h5>
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
                </Card>
              );
            })}
          </CardGroup>
        </SectionWrapper>
      )}
      <h2 className="margin-top-5 margin-bottom-4">
        {t('singleSystem.teamAndContract.header.pointsOfContact')}
      </h2>
      <CardGroup className="margin-0">
        {data!
          .cedarSystemDetails!.roles.filter(
            role => role.assigneeType === CedarAssigneeType.PERSON
          )
          .map(contact => (
            <Card key={contact.roleID} className="grid-col-12 margin-bottom-2">
              <CardHeader className="padding-2 padding-bottom-0">
                <h5 className="margin-y-0 font-sans-2xs text-normal">
                  {contact.roleTypeName}
                </h5>
                <h3 className="margin-y-0">{showPersonFullName(contact)}</h3>
                {contact.assigneeEmail !== null && (
                  <div>
                    <Link
                      className="line-height-body-5"
                      href={`mailto:${contact.assigneeEmail}`}
                      target="_blank"
                    >
                      {contact.assigneeEmail}
                      <IconMailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
                    </Link>
                  </div>
                )}
              </CardHeader>
              <CardBody className="padding-x-2 padding-top-0">
                {contact.assigneeOrgName !== null && (
                  <>
                    <Divider className="margin-y-2" />
                    {contact.assigneeOrgName}
                  </>
                )}
              </CardBody>
            </Card>
          ))}
      </CardGroup>
    </>
  );
};

export default SystemTeamAndContract;
