import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  IconCheck,
  IconHelpOutline,
  Table
} from '@trussworks/react-uswds';

// import classnames from 'classnames';
import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import { showSystemVal } from 'utils/showVal';

const SystemData = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');

  const { exchanges } = system;

  return (
    <>
      <SectionWrapper borderBottom className="margin-bottom-4 padding-bottom-4">
        <h2 id="system" className="margin-top-0">
          {t('singleSystem.systemData.header')}
        </h2>
        <DescriptionTerm term="Enterprise Data Lake status" />
        <DescriptionDefinition
          className="font-body-md line-height-body-3"
          definition={showSystemVal(null)}
        />
        <DescriptionTerm term="Metadata glossary" className="margin-top-4" />
        <DescriptionDefinition
          className="font-body-md line-height-body-3"
          definition="Yes, this system has glossary information or metadata descriptions"
        />
        <Table bordered={false} fullWidth scrollable>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-bottom-2px"
                style={{ width: '50%' }}
              >
                Data category
              </th>
              <th
                scope="col"
                className="border-bottom-2px"
                style={{ width: '50%' }}
              >
                Collected, used, or stored?
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Beneficiary information (address, email, mobile number)</td>
              <td>
                {showSystemVal(
                  system.cedarSystemDetails?.businessOwnerInformation
                    .storesBeneficiaryAddress
                    ? 'Yes'
                    : 'No'
                )}
              </td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Personally Identifiable Information (PII)</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Protected Health Information (PHI)</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Sensitive Information</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Data used to analyze beneficiary health disparities</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td className="border-bottom-0">Banking data</td>
              <td className="border-bottom-0">
                {showSystemVal(
                  system.cedarSystemDetails?.businessOwnerInformation
                    .storesBankingData
                    ? 'Yes'
                    : 'No'
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </SectionWrapper>

      <SectionWrapper borderBottom className="margin-bottom-4 padding-bottom-5">
        <h2 id="api" className="margin-top-0">
          {t('singleSystem.systemData.apiInfo')}
        </h2>

        <Grid row className="margin-top-3">
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.apiStatus')}
            />

            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition="API developed and launched"
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.fHIRUsage')}
            />

            <DescriptionDefinition
              className="line-height-body-3 font-body-md"
              definition="This API does not use FHIR"
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term="API description location"
            />

            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-5 margin-right-1"
              definition="Published on developer.cms.gov"
            />

            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.apiGateway')}
            />

            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-2"
              definition={showSystemVal(null)}
            />
            {/* TODO: Add hash-fragment to direct and scroll on the tools subpage */}
            <UswdsReactLink to="tools-and-software">
              {t('singleSystem.systemData.viewGateway')}
            </UswdsReactLink>
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.access')}
            />

            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-5"
              definition="Both internal and external access"
            />
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term="API Portal"
            />

            <DescriptionDefinition
              className="line-height-body-3"
              definition="This system has an API portal"
            />
          </Grid>
        </Grid>

        {/*
        <h3 className="margin-top-0 margin-bottom-1">
          {t('singleSystem.systemData.dataCategories')}
        </h3>
        {system?.developmentTags?.map((tag: string) => (
          <Tag
            key={tag}
            className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
          >
            {tag}
          </Tag>
        ))}
        */}
      </SectionWrapper>

      <SectionWrapper
        borderBottom={!isMobile}
        className="padding-bottom-4 margin-bottom-4"
      >
        <h2 id="exchanges" className="margin-top-0">
          {t('singleSystem.systemData.dataExchanges')}
        </h2>

        <CardGroup className="margin-0">
          {/* {system.systemData?.map(data => { */}
          {exchanges.map(data => {
            return (
              <Card
                key={data.exchangeId}
                className="grid-col-12 margin-bottom-2"
              >
                <CardHeader className="padding-2 padding-bottom-0">
                  <div className="margin-bottom-0 easi-header__basic flex-align-baseline">
                    <h3 className="margin-top-0 margin-bottom-1">
                      {data.exchangeName}
                    </h3>
                    <Tag className="bg-success-dark text-white">
                      <IconCheck className="margin-right-1" margin-right />
                      Active
                    </Tag>

                    {/* <Tag
                      className={classnames('font-body-md', 'margin-bottom-1', {
                        'bg-success-dark text-white':
                          data.status === 'Active' || data.status === 'Passed',
                        'bg-warning':
                          data.status === 'Requires response' ||
                          data.status === 'QA review pending',
                        'bg-white text-base border-base border-2px':
                          data.status === 'Not applicable'
                      })}
                    >
                      {data.status}
                    </Tag> */}
                  </div>
                  {/* <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-2">
                    <IconFileDownload className="text-base-darker margin-right-1" />
                    Receives Data{' '}
                  </Tag> */}
                </CardHeader>
                <CardBody className="padding-2">
                  <p className="line-clamp-3">{data.exchangeDescription}</p>

                  <div className="margin-bottom-3">
                    {data.sharedViaApi && (
                      <Tag className="text-base-darker bg-base-lighter">
                        Shared via API
                      </Tag>
                    )}
                    {!data.sharedViaApi && (
                      <Tag className="text-base-darker bg-base-lighter text-normal text-italic">
                        <IconHelpOutline
                          className="margin-right-1 "
                          margin-right
                        />
                        Exchange direction unknown
                      </Tag>
                    )}
                  </div>

                  <Grid row className="margin-top-3">
                    <Grid tablet={{ col: 6 }} className="margin-bottom-2">
                      <DescriptionTerm
                        className="display-inline-flex margin-right-1"
                        term="Frequency"
                      />

                      <DescriptionDefinition
                        className="font-body-md line-height-body-3"
                        definition={data.connectionFrequency.join(', ')}
                      />
                    </Grid>
                    <Grid tablet={{ col: 6 }} className="margin-bottom-2">
                      <DescriptionTerm
                        className="display-inline-flex margin-right-1"
                        term="Number of records"
                      />

                      <DescriptionDefinition
                        className="line-height-body-3 font-body-md"
                        definition={data.numOfRecords}
                      />
                    </Grid>
                  </Grid>

                  <Divider />
                  <GridContainer className="padding-x-0 margin-top-2">
                    <Grid row>
                      <Grid col>
                        <div className="margin-bottom-0 easi-header__basic flex-align-baseline">
                          <DescriptionTerm
                            className="display-inline-flex margin-right-1"
                            term={t('singleSystem.systemData.dataPartner')}
                          />

                          {/*
                          <Tag
                            className={classnames(
                              'font-body-md',
                              'margin-bottom-1',
                              {
                                'bg-success-dark text-white':
                                  data.dataPartnerStatus === 'Active' ||
                                  data.dataPartnerStatus === 'Passed',
                                'bg-warning':
                                  data.dataPartnerStatus ===
                                    'Requires response' ||
                                  data.dataPartnerStatus ===
                                    'QA review pending',
                                'bg-white text-base border-base border-2px':
                                  data.dataPartnerStatus === 'Not applicable'
                              }
                            )}
                          >
                            {data.dataPartnerStatus}
                          </Tag>
                          */}
                        </div>
                        <DescriptionDefinition
                          className="line-height-body-3"
                          definition={showSystemVal(null)}
                        />
                        <DescriptionTerm
                          className="display-inline-flex margin-top-2 margin-right-1"
                          term="Information exchange agreement"
                        />

                        <DescriptionDefinition
                          className="line-height-body-3"
                          definition={showSystemVal(data.dataExchangeAgreement)}
                        />
                      </Grid>
                    </Grid>
                  </GridContainer>
                </CardBody>
              </Card>
            );
          })}
        </CardGroup>
      </SectionWrapper>
      <SectionWrapper className="margin-bottom-4 padding-bottom-4">
        <h2 id="records" className="margin-top-0">
          Records management
        </h2>

        <Grid row>
          <Grid tablet={{ col: 6 }} className="margin-bottom-3">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term="Records management schedule"
            />

            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(null)}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-3">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term="Records diposal"
            />
            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(null)}
            />
          </Grid>
        </Grid>

        <Grid>
          <Grid tablet={{ col: true }}>
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term="Persistent records"
            />

            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(null)}
            />
          </Grid>
        </Grid>

        {/* <h3 className="margin-top-2 margin-bottom-1">
          {t('singleSystem.systemData.recordCategories')}
        </h3>
        {developmentTags?.map(tag => (
          <Tag
            key={tag}
            className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
          >
            {tag}
          </Tag>
        ))} */}
      </SectionWrapper>
    </>
  );
};

export default SystemData;
