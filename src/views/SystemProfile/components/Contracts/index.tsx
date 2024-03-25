import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  IconVerified
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import { GetSystemProfile_cedarContractsBySystem as ContractType } from 'queries/types/GetSystemProfile';
import { SystemProfileSubviewProps } from 'types/systemProfile';

const ContractCard = ({ contract }: { contract: ContractType }) => {
  const { t } = useTranslation('systemProfile');

  return (
    <Card
      key={contract.id}
      data-testid="system-contract-card"
      className="grid-col-12"
    >
      <CardHeader className="padding-2 padding-bottom-0 text-top">
        <dt>{t('singleSystem.contracts.contractTitle')}</dt>

        <h3 className="margin-y-0 margin-bottom-1">
          {contract.contractName || t('singleSystem.contracts.noContract')}
        </h3>
      </CardHeader>

      <CardBody className="padding-x-2 padding-y-0">
        {contract.isDeliveryOrg && (
          <div className="display-flex flex-align-center margin-bottom-1">
            <IconVerified className="margin-right-1 text-info-dark" />
            <span style={{ marginTop: '1px' }}>
              {t('singleSystem.contracts.isDeliveryOrg')}
            </span>
          </div>
        )}

        <Grid row className="margin-y-2">
          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.contractNumber')}
            />
            <DescriptionDefinition
              className="text-pre-wrap text-italic text-base"
              definition={
                contract.contractNumber || t('singleSystem.contracts.noData')
              }
            />
          </Grid>

          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.taskOrderNumber')}
            />
            <DescriptionDefinition
              className="text-pre-wrap text-italic text-base"
              definition={
                contract.orderNumber || t('singleSystem.contracts.noData')
              }
            />
          </Grid>
        </Grid>

        <Divider />

        <Grid row className="margin-y-2">
          <Grid desktop={{ col: 12 }}>
            <p className="margin-top-0 margin-bottom-1">
              {t('singleSystem.contracts.periodOfPerformance')}
            </p>
          </Grid>

          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.startDate')}
            />
            <DescriptionDefinition
              className="text-pre-wrap text-italic text-base"
              definition={
                contract.startDate || t('singleSystem.contracts.noData')
              }
            />
          </Grid>

          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm
              className="margin-bottom-0"
              term={t('singleSystem.contracts.endDate')}
            />
            <DescriptionDefinition
              className="text-pre-wrap text-italic text-base"
              definition={
                contract.endDate || t('singleSystem.contracts.noData')
              }
            />
          </Grid>
        </Grid>

        <Divider />
      </CardBody>

      <CardFooter className="padding-2">
        <Grid row>
          <Grid desktop={{ col: 12 }}>
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
      </CardFooter>
    </Card>
  );
};

const Contracts = ({ system }: SystemProfileSubviewProps) => {
  return (
    <CardGroup className="margin-0">
      {system.cedarContractsBySystem?.map(
        (contract): React.ReactNode => (
          <ContractCard contract={contract} />
        )
      )}
    </CardGroup>
  );
};

export default Contracts;
