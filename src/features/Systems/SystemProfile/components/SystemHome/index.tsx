import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { showAtoExpirationDate } from 'features/Systems/SystemProfile/util';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import SectionWrapper from 'components/SectionWrapper';
import Tag from 'components/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import formatDollars from 'utils/formatDollars';
import showVal, { showSystemVal } from 'utils/showVal';

import { ExchangeDirectionTag } from '../SystemData';

const SystemHome = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');

  const { ato, locations, productionLocation } = system;

  const urlLocationCard = useMemo(() => {
    if (!productionLocation) return undefined;

    const urlcount = locations?.length;
    const urlsleft = urlcount ? urlcount - 1 : 0;
    const topts: any = {
      count: urlsleft
    };
    // https://github.com/i18next/i18next/issues/1220#issuecomment-654161038
    if (urlsleft === 0) topts.context = 'nocount';

    const moreUrls = t('singleSystem.systemDetails.moreURLs', topts);

    return {
      ...productionLocation,
      moreUrls
    };
  }, [locations, productionLocation, t]);

  return (
    <SectionWrapper borderBottom={isMobile}>
      <CardGroup className="margin-0">
        {urlLocationCard && (
          <Card className="grid-col-12">
            <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
              <Grid row>
                <Grid desktop={{ col: 12 }} className="padding-0">
                  <dt>
                    {t('singleSystem.systemDetails.environment', {
                      environment: urlLocationCard.urlHostingEnv
                    })}
                  </dt>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody className="padding-x-2 padding-y-0">
              <Grid row>
                <Grid desktop={{ col: 12 }} className="padding-0">
                  <h3 className="link-header margin-top-0 margin-bottom-2">
                    <Link
                      className="link-header url-card-link"
                      variant="external"
                      target="_blank"
                      href={urlLocationCard.address!}
                    >
                      {urlLocationCard.address}
                    </Link>
                  </h3>
                  <div className="margin-bottom-2">
                    <UswdsReactLink
                      className="link-header"
                      to={`/systems/${system.id}/details#system-detail`}
                    >
                      {urlLocationCard.moreUrls}
                      <span aria-hidden>&nbsp;</span>
                      <span aria-hidden>&rarr; </span>
                    </UswdsReactLink>
                  </div>
                </Grid>
              </Grid>
              <Divider />
            </CardBody>
            <CardFooter className="padding-0">
              <Grid row>
                <Grid className="padding-2">
                  <DescriptionTerm
                    term={t('singleSystem.systemDetails.provider')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition={urlLocationCard.deploymentDataCenterName}
                  />
                </Grid>
              </Grid>
            </CardFooter>
          </Card>
        )}
        <Card className="grid-col-12">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
            <dt>{t('singleSystem.ato.atoExpiration')}</dt>
            <div className="text-right margin-bottom-0">
              <Tag
                className={classnames('grid-col-12', {
                  'bg-success-dark': system.atoStatus === 'Active',
                  'bg-warning': system.atoStatus === 'Due Soon', // || system.atoStatus === 'In progress',
                  'bg-error-dark': system.atoStatus === 'Expired',
                  'bg-base-lighter': system.atoStatus === 'No ATO',
                  'text-white':
                    system.atoStatus === 'Active' ||
                    system.atoStatus === 'Expired'
                })}
              >
                {system.atoStatus}
              </Tag>
            </div>
          </CardHeader>

          <CardBody className="padding-x-2 padding-y-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <h3 className="link-header margin-top-0 margin-bottom-2">
                  {ato?.oaStatus === 'OA Member'
                    ? t('singleSystem.ato.atoOngoing')
                    : showAtoExpirationDate(ato?.dateAuthorizationMemoExpires)}
                </h3>
                <div className="margin-bottom-2">
                  <UswdsReactLink
                    className="link-header"
                    to={`/systems/${system.id}/ato-and-security#ato-and-security`}
                  >
                    {t('singleSystem.ato.viewATOInfo')}
                    <span aria-hidden>&nbsp;</span>
                    <span aria-hidden>&rarr; </span>
                  </UswdsReactLink>
                </div>
              </Grid>
            </Grid>
            <Divider />
          </CardBody>
          <CardFooter className="padding-0">
            <Grid row>
              <Grid desktop={{ col: 6 }} className="padding-2">
                <DescriptionTerm term={t('singleSystem.ato.totalPOAM')} />
                <DescriptionDefinition
                  className="line-height-body-3"
                  definition={showVal(ato?.countOfOpenPoams)}
                />
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
        <Card className="grid-col-12">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <dt>{t('singleSystem.systemData.apiStatus')}</dt>
              </Grid>
            </Grid>
          </CardHeader>

          <CardBody className="padding-x-2 padding-y-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <h3 className="link-header margin-top-0 margin-bottom-2">
                  {system.cedarSoftwareProducts?.apisDeveloped === 'Yes'
                    ? t('singleSystem.systemData.apiStatusValues.apiDeveloped')
                    : t(
                        'singleSystem.systemData.apiStatusValues.noApiDeveloped'
                      )}
                </h3>
                <div className="margin-bottom-2">
                  <UswdsReactLink
                    className="link-header"
                    to={`/systems/${system.id}/system-data#system-data`}
                  >
                    {t('singleSystem.systemData.viewAPIInfo')}
                    <span aria-hidden>&nbsp;</span>
                    <span aria-hidden>&rarr; </span>
                  </UswdsReactLink>
                </div>
              </Grid>
            </Grid>
            <Divider />
          </CardBody>
          <CardFooter className="padding-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-2">
                <DescriptionTerm
                  term={t('singleSystem.systemData.dataCategories')}
                />
                {system.cedarSoftwareProducts?.apiDataArea?.length ? (
                  <>
                    {system.cedarSoftwareProducts.apiDataArea.length > 2 ? (
                      <>
                        {system.cedarSoftwareProducts.apiDataArea.map(
                          (tag, index) =>
                            index < 2 && (
                              <Tag
                                key={tag}
                                className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                              >
                                {tag}
                              </Tag>
                            )
                        )}
                        <UswdsReactLink
                          className="link-header"
                          to={`/systems/${system.id}/system-data#data-categories`}
                        >
                          <Tag
                            key="expand-tags"
                            className="system-profile__tag bg-base-lighter margin-bottom-1 pointer bg-primary text-white"
                          >
                            +
                            {system.cedarSoftwareProducts.apiDataArea.length -
                              2}
                          </Tag>
                        </UswdsReactLink>
                      </>
                    ) : (
                      system.cedarSoftwareProducts.apiDataArea.map(tag => (
                        <Tag
                          key={tag}
                          className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                        >
                          {tag}
                        </Tag>
                      ))
                    )}
                  </>
                ) : (
                  showSystemVal(null)
                )}
              </Grid>
            </Grid>
          </CardFooter>
        </Card>

        <Card className="grid-col-12">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
            <p className="margin-y-0">
              {t('singleSystem.fundingAndBudget.systemFiscalYear')}
            </p>
            <p className="margin-y-0 text-base">
              {t('singleSystem.fundingAndBudget.fiscalYear')}:{' '}
              {system.budgetSystemCosts?.budgetActualCost[0].fiscalYear}
            </p>
          </CardHeader>
          <CardBody className="padding-2 padding-top-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <h3 className="link-header margin-top-0 margin-bottom-2">
                  {system.budgetSystemCosts?.budgetActualCost[0]
                    .actualSystemCost
                    ? formatDollars(
                        Math.trunc(
                          Number(
                            system.budgetSystemCosts?.budgetActualCost[0]
                              .actualSystemCost
                          )
                        )
                      )
                    : t('singleSystem.noDataAvailable')}
                </h3>
                <UswdsReactLink
                  className="link-header"
                  to={`/systems/${system.id}/funding-and-budget#funding-and-budget`}
                >
                  {t('singleSystem.fundingAndBudget.viewMoreBudgetAndFunding')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </UswdsReactLink>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        <Card className="grid-col-12">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top margin-bottom-2">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <dt>{t('singleSystem.systemData.dataExchanges')}</dt>
              </Grid>
            </Grid>
          </CardHeader>

          <CardBody className="padding-x-2 padding-y-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                {system.exchanges.length && (
                  <>
                    {system.exchanges.map(
                      (exchange, index) =>
                        index < 2 && (
                          <div
                            className={`display-flex flex-wrap flex-align-center ${index === 0 ? 'margin-bottom-05' : 'margin-bottom-2'}`}
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                          >
                            <ExchangeDirectionTag
                              data={exchange.exchangeDirection}
                            />
                            <p key={exchange.exchangeId} className="margin-y-0">
                              <span className="text-bold">
                                {exchange.exchangeName}
                              </span>
                            </p>
                          </div>
                        )
                    )}
                    <UswdsReactLink
                      className="link-header margin-top-2"
                      to={`/systems/${system.id}/system-data#exchanges`}
                    >
                      {system.exchanges.length > 2
                        ? t('singleSystem.systemData.viewMoreExchanges', {
                            count: system.exchanges.length - 2
                          })
                        : t('singleSystem.systemData.viewDataExchange')}
                      <span aria-hidden>&nbsp;</span>
                      <span aria-hidden>&rarr; </span>
                    </UswdsReactLink>
                  </>
                )}
                {!system.exchanges.length && (
                  <span className="text-italic">
                    {t('singleSystem.systemData.noExchangesAlert')}
                  </span>
                )}
              </Grid>
            </Grid>
            <Divider className="margin-top-2" />
          </CardBody>
          <CardFooter className="padding-2">
            <Grid row>
              <Grid tablet={{ col: 6 }}>
                <DescriptionTerm
                  className="display-inline-flex margin-right-1"
                  term={t('singleSystem.systemData.numberOfSystemDependencies')}
                />
                <DescriptionDefinition
                  className="font-body-md line-height-body-3"
                  definition={
                    system.exchanges.filter(
                      e => e.exchangeDirection === 'SENDER'
                    ).length
                  }
                />
              </Grid>
              <Grid tablet={{ col: 6 }}>
                <DescriptionTerm
                  className="display-inline-flex margin-right-1"
                  term={t('singleSystem.systemData.numberOfDependentSystems')}
                />
                <DescriptionDefinition
                  className="line-height-body-3 font-body-md"
                  definition={
                    system.exchanges.filter(
                      e => e.exchangeDirection === 'RECEIVER'
                    ).length
                  }
                />
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
        <Card className="grid-col-12">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top margin-bottom-2">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <dt>{t('singleSystem.subSystems.header')}</dt>
              </Grid>
            </Grid>
          </CardHeader>

          <CardBody className="padding-x-2 padding-y-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                {system.cedarSubSystems.length
                  ? system.cedarSubSystems.map(
                      (subsystem, index) =>
                        index < 2 && (
                          <p key={subsystem.id} className="margin-y-0">
                            <span className="text-bold">{subsystem.name}</span>{' '}
                            {subsystem.acronym && `(${subsystem.acronym})`}
                          </p>
                        )
                    )
                  : showSystemVal(null)}
              </Grid>
            </Grid>
          </CardBody>
          <CardFooter className="padding-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-2">
                <UswdsReactLink
                  className="link-header"
                  to={`/systems/${system.id}/sub-systems#system-sub-systems`}
                >
                  {system.cedarSubSystems.length > 2
                    ? t('singleSystem.subSystems.viewMore', {
                        count: system.cedarSubSystems.length - 2
                      })
                    : t('singleSystem.subSystems.viewInfo')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </UswdsReactLink>
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
        <Card className="grid-col-12 margin-bottom-0">
          <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <dt>{t('singleSystem.team.totalEmployees')}</dt>
              </Grid>
            </Grid>
          </CardHeader>

          <CardBody className="padding-x-2 padding-y-0">
            <Grid row>
              <Grid desktop={{ col: 12 }} className="padding-0">
                <h3 className="link-header margin-top-0 margin-bottom-2">
                  {system.numberOfFte}
                </h3>
                <UswdsReactLink
                  className="link-header"
                  to={`/systems/${system.id}/team#system-team`}
                >
                  {t('singleSystem.team.viewMoreInfo')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </UswdsReactLink>
              </Grid>
            </Grid>
            <Divider className="margin-top-2" />
          </CardBody>
          <CardFooter className="padding-0">
            <Grid row>
              <Grid desktop={{ col: 6 }} className="padding-2">
                <DescriptionTerm term={t('singleSystem.team.federalFTE')} />
                <DescriptionDefinition
                  className="line-height-body-3"
                  definition={system.numberOfFederalFte}
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="padding-2">
                <DescriptionTerm term={t('singleSystem.team.contractorFTE')} />
                <DescriptionDefinition
                  className="line-height-body-3"
                  definition={system.numberOfContractorFte}
                />
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
      </CardGroup>
    </SectionWrapper>
  );
};

export default SystemHome;
