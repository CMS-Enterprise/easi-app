import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  Icon,
  Table
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import { GetSystemProfile_exchanges as Exchange } from 'queries/types/GetSystemProfile';
import { ExchangeDirection } from 'types/graphql-global-types';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import { showSystemVal } from 'utils/showVal';

// The majority of values rendered the components here are one-offs
// sometimes due to changing source data

export function ExchangeDirectionTag({
  data
}: {
  data: Exchange['exchangeDirection'];
}) {
  const { t } = useTranslation('systemProfile');

  return (
    <Tag className="text-base-darker bg-base-lighter display-flex flex-align-center width-fit-content">
      {data === ExchangeDirection.RECEIVER && (
        <>
          <Icon.FileDownload className="margin-right-1" />
          {t('singleSystem.systemData.exchangeDirection.receives')}
        </>
      )}
      {data === ExchangeDirection.SENDER && (
        <>
          <Icon.FileUpload className="margin-right-1" />
          {t('singleSystem.systemData.exchangeDirection.sends')}
        </>
      )}
      {data === null && (
        <>
          <Icon.HelpOutline className="margin-right-1" />
          <span className="text-normal text-italic">
            {t('singleSystem.systemData.exchangeDirection.unknown')}
          </span>
        </>
      )}
    </Tag>
  );
}

function ExchangeCard({ data }: { data: Exchange }) {
  const { t } = useTranslation('systemProfile');

  // Header description expand toggle
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isDescriptionExpandable, setIsDescriptionExpandable] =
    useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false);

  // Enable the description toggle if it overflows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  });

  return (
    <Card className="grid-col-12 margin-bottom-2">
      <CardHeader className="padding-2 padding-bottom-0">
        <div className="margin-bottom-0 easi-header__basic flex-align-baseline">
          <h3 className="margin-top-0 margin-bottom-1">{data.exchangeName}</h3>
          <Tag className="bg-base-lighter text-darker text-normal text-italic display-flex flex-align-center">
            <Icon.HelpOutline className="margin-right-1" />
            {t('singleSystem.systemData.statusUnknown')}
          </Tag>
        </div>
      </CardHeader>
      <CardBody className="padding-2 padding-top-0">
        <div
          className={classNames('description-truncated', 'margin-bottom-2', {
            expanded: descriptionExpanded
          })}
        >
          <p
            ref={descriptionRef}
            className="description-definition line-clamp-3 margin-y-0"
          >
            {data.exchangeDescription}
          </p>
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
                <Icon.ExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
              </Button>
            </div>
          )}
        </div>

        <div className="display-flex margin-bottom-3">
          <ExchangeDirectionTag data={data.exchangeDirection} />
          {data.sharedViaApi && (
            <Tag className="text-base-darker bg-base-lighter">
              {t('singleSystem.systemData.sharedViaAPI')}
            </Tag>
          )}
        </div>

        <Grid row className="margin-top-3">
          <Grid tablet={{ col: 6 }} className="margin-bottom-2">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.frequency')}
            />
            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={data.connectionFrequency.join(', ')}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-2">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.numberOfRecords')}
            />
            <DescriptionDefinition
              className="line-height-body-3 font-body-md"
              definition={data.numOfRecords}
            />
          </Grid>
        </Grid>
        <Divider />
        <DescriptionTerm
          className="display-inline-flex margin-top-2 margin-right-1"
          term={t('singleSystem.systemData.dataPartner')}
        />
        <DescriptionDefinition
          className="line-height-body-3"
          definition={showSystemVal(null)}
        />
        <DescriptionTerm
          className="display-inline-flex margin-top-2 margin-right-1"
          term={t('singleSystem.systemData.informationExchangeAgreement')}
        />
        <DescriptionDefinition
          className="line-height-body-3"
          definition={showSystemVal(data.dataExchangeAgreement)}
        />
      </CardBody>
    </Card>
  );
}

const SystemData = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');

  const { exchanges } = system;

  const exchangesCountCap = 5;
  const [isExchangesExpanded, setExchangesExpanded] = useState<boolean>(false);
  const showMoreExchangesToggle = exchanges.length - exchangesCountCap > 0;

  return (
    <>
      <SectionWrapper borderBottom className="margin-bottom-4 padding-bottom-4">
        <h2 id="system" className="margin-top-0">
          {t('singleSystem.systemData.header')}
        </h2>
        {/*
        Enterprise status n/a
        <DescriptionTerm term={t('singleSystem.systemData.enterpriseStatus')} />
        <DescriptionDefinition
          className="font-body-md line-height-body-3"
          definition={showSystemVal(null)}
        />

        Metadata indirect, would need parse
        <DescriptionTerm
          term={t('singleSystem.systemData.metadataGlossary')}
          className="margin-top-4"
        />
        <DescriptionDefinition
          className="font-body-md line-height-body-3"
          definition="Yes, this system has glossary information or metadata descriptions"
        />
        */}
        <Table bordered={false} fullWidth scrollable>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-bottom-2px"
                style={{ width: '50%' }}
              >
                {t('singleSystem.systemData.dataCategory')}
              </th>
              <th
                scope="col"
                className="border-bottom-2px"
                style={{ width: '50%' }}
              >
                {t('singleSystem.systemData.collectedUsedStored')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ verticalAlign: 'top' }}>
              <td>{t('singleSystem.systemData.beneficiaryInfo')}</td>
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
              <td>{t('singleSystem.systemData.pII')}</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>{t('singleSystem.systemData.pHI')}</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>{t('singleSystem.systemData.sensitiveInformation')}</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>{t('singleSystem.systemData.collectedUsedStored')}</td>
              <td>{showSystemVal(null)}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td className="border-bottom-0">
                {t('singleSystem.systemData.bankingData')}
              </td>
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
              definition={showSystemVal(null)}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.fHIRUsage')}
            />
            <DescriptionDefinition
              className="line-height-body-3 font-body-md"
              definition={showSystemVal(
                system.cedarSoftwareProducts?.apiFHIRUse
              )}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-5">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.apiDescriptionLocation')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-5 margin-right-1"
              definition={showSystemVal(
                system.cedarSoftwareProducts?.apiDescPublished
              )}
            />

            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.apiGateway')}
            />
            <DescriptionDefinition
              className="line-height-body-3 margin-bottom-2"
              definition={showSystemVal(
                system.cedarSoftwareProducts?.systemHasAPIGateway,
                {
                  format: v => (v ? 'Yes' : 'No')
                }
              )}
            />
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
              definition={showSystemVal(
                system.cedarSoftwareProducts?.apisAccessibility
              )}
            />
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.apiPortal')}
            />
            <DescriptionDefinition
              className="line-height-body-3"
              definition={showSystemVal(
                system.cedarSoftwareProducts?.apiHasPortal,
                {
                  format: v =>
                    v ? 'This system has an API portal' : 'No API portal'
                }
              )}
            />
          </Grid>
        </Grid>

        <h3
          className="margin-top-0 margin-bottom-1 scroll-margin-top-6"
          id="data-categories"
        >
          {t('singleSystem.systemData.dataCategories')}
        </h3>
        {system.cedarSoftwareProducts?.apiDataArea
          ? system.cedarSoftwareProducts?.apiDataArea.map(tag => (
              <Tag
                key={tag}
                className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
              >
                {tag}
              </Tag>
            ))
          : showSystemVal(null)}
      </SectionWrapper>

      <SectionWrapper className="padding-bottom-4 margin-bottom-4">
        <h2 id="exchanges" className="margin-top-0">
          {t('singleSystem.systemData.dataExchanges')}
        </h2>

        {exchanges.length ? (
          <>
            <CardGroup className="margin-0">
              {exchanges
                .slice(0, isExchangesExpanded ? undefined : exchangesCountCap)
                .map(data => (
                  <ExchangeCard
                    key={`${data.exchangeId} ${data.exchangeName}`}
                    data={data}
                  />
                ))}
            </CardGroup>
            {showMoreExchangesToggle && (
              <Button
                unstyled
                type="button"
                className="line-height-body-5"
                onClick={() => {
                  setExchangesExpanded(!isExchangesExpanded);
                }}
              >
                {t(
                  `singleSystem.systemData.showExchanges.${
                    isExchangesExpanded ? 'less' : 'more'
                  }`
                )}
                <Icon.ExpandMore
                  className="margin-left-05 margin-bottom-2px text-tbottom"
                  style={{
                    transform: isExchangesExpanded ? 'rotate(180deg)' : ''
                  }}
                />
              </Button>
            )}
          </>
        ) : (
          <Alert type="info" headingLevel="h4">
            {t('singleSystem.systemData.noExchangesAlert')}
          </Alert>
        )}
      </SectionWrapper>

      {/*
      Records management n/a
      <SectionWrapper className="margin-bottom-4 padding-bottom-4">
        <h2 id="records" className="margin-top-0">
          {t('singleSystem.systemData.recordsManagement')}
        </h2>

        <Grid row>
          <Grid tablet={{ col: 6 }} className="margin-bottom-3">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.recordsSchedule')}
            />

            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(null)}
            />
          </Grid>
          <Grid tablet={{ col: 6 }} className="margin-bottom-3">
            <DescriptionTerm
              className="display-inline-flex margin-right-1"
              term={t('singleSystem.systemData.recordsDisposal')}
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
              term={t('singleSystem.systemData.persistentRecords')}
            />

            <DescriptionDefinition
              className="font-body-md line-height-body-3"
              definition={showSystemVal(null)}
            />
          </Grid>
        </Grid>

        <h3 className="margin-top-2 margin-bottom-1">
          {t('singleSystem.systemData.recordCategories')}
        </h3>
        {developmentTags?.map(tag => (
          <Tag
            key={tag}
            className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
          >
            {tag}
          </Tag>
        ))}
      </SectionWrapper>
      */}
    </>
  );
};

export default SystemData;
