import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import { GetSystemProfile_cedarContractsBySystem as ContractType } from 'gql/legacyGQL/types/GetSystemProfile';

import Alert from 'components/Alert';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

const ContractCard = ({ contract }: { contract: ContractType }) => {
  const { t } = useTranslation('systemProfile');

  return (
    <Card data-testid="system-contract-card" className="grid-col-12">
      <CardHeader className="padding-2 padding-bottom-0 text-top">
        <dt>{t('singleSystem.contracts.contractTitle')}</dt>

        <h3 className="margin-y-0 margin-bottom-1 line-height-body-2">
          {contract.contractName || t('singleSystem.contracts.noContract')}
        </h3>
      </CardHeader>

      <CardBody className="padding-x-2 padding-y-0">
        {contract.isDeliveryOrg && (
          <div className="display-flex flex-align-center margin-y-1">
            <Icon.Verified className="margin-right-1 text-info-dark" />
            <span style={{ marginTop: '1px' }}>
              {t('singleSystem.contracts.isDeliveryOrg')}
            </span>
          </div>
        )}

        <Grid row className="margin-y-2">
          <Grid tablet={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.contractNumber')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={showVal(contract.contractNumber, {
                defaultVal: t('singleSystem.contracts.noData')
              })}
            />
          </Grid>

          <Grid tablet={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.taskOrderNumber')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={showVal(contract.orderNumber, {
                defaultVal: t('singleSystem.contracts.noData')
              })}
            />
          </Grid>
        </Grid>

        <Divider />

        <Grid row className="margin-y-2">
          <Grid tablet={{ col: 12 }}>
            <p className="margin-top-0 margin-bottom-1">
              {t('singleSystem.contracts.periodOfPerformance')}
            </p>
          </Grid>

          <Grid tablet={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.startDate')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={showVal(
                formatDateUtc(contract.startDate, 'MM/dd/yyyy'),
                {
                  defaultVal: t('singleSystem.contracts.noData')
                }
              )}
            />
          </Grid>

          <Grid tablet={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.endDate')}
            />
            <DescriptionDefinition
              className="text-pre-wrap"
              definition={showVal(
                formatDateUtc(contract.endDate, 'MM/dd/yyyy'),
                {
                  defaultVal: t('singleSystem.contracts.noData')
                }
              )}
            />
          </Grid>
        </Grid>

        {/* TODO: Implement 'Contract services or functions' once connected to CEDAR */}

        {/* <Divider /> */}
      </CardBody>

      {/* <CardFooter className="padding-2">
        <Grid row>
          <Grid tablet={{ col: 12 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.contractServices')}
            />
            {!contract.serviceProvided && (
              <DescriptionDefinition
                className="text-pre-wrap text-italic text-base"
                definition={t('singleSystem.contracts.noData')}
              />
            )}
          </Grid>
        </Grid>
      </CardFooter> */}
    </Card>
  );
};

const Contracts = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');

  return (
    <>
      <h2 className="margin-top-0">
        {t('singleSystem.contracts.contractInfo')}
      </h2>

      {system.cedarContractsBySystem.length > 0 ? (
        <CardGroup className="margin-0">
          {system.cedarContractsBySystem?.map(
            (contract): React.ReactNode => (
              <ContractCard
                contract={contract}
                key={`${contract.systemID}${contract.contractNumber}${contract.orderNumber}`}
              />
            )
          )}
        </CardGroup>
      ) : (
        <Alert type="info" slim>
          {t('singleSystem.contracts.noContracts')}
        </Alert>
      )}
    </>
  );
};

export default Contracts;
