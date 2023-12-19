import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Card,
  CardGroup,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Tag from 'components/shared/Tag';
import { SystemProfileSubviewProps } from 'types/systemProfile';

import './index.scss';

const SystemToolsAndSoftware = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');

  return (
    <>
      <h2 className="margin-top-0 margin-bottom-4">
        {t('singleSystem.toolsAndSoftware.header')}
      </h2>
      {system.products !== undefined && system.products.length > 0 ? (
        <CardGroup className="margin-0">
          {system.products?.map(product => {
            return (
              <Card
                key={product.systemSoftwareConnectionGuid}
                className="grid-col-12 margin-bottom-2"
              >
                <CardHeader className="padding-2 padding-bottom-1">
                  <h3 className="margin-top-0 margin-bottom-1 line-height-sans-2">
                    {product.softwareName}
                  </h3>
                  {product.vendorName ? (
                    <>{product.vendorName}</>
                  ) : (
                    <>
                      {t('singleSystem.toolsAndSoftware.noManufacturerListed')}
                    </>
                  )}
                  {/* TODO: handle ELA Purchase field */}
                  <Grid col>
                    <DescriptionTerm
                      className="margin-top-1"
                      term={t('singleSystem.toolsAndSoftware.productCategory')}
                    />
                    <DescriptionDefinition
                      className="font-body-md line-height-body-4 margin-bottom-2"
                      definition={product.technopediaCategory}
                    />
                    {/* Condtionally render software product tags
                        TODO: break this out into separate function? */}
                    {product.providesAiCapability && (
                      <Tag
                        className="text-base-darker bg-base-lighter margin-bottom-1"
                        key={product.technopediaCategory} // TODO: NJD - need unique key
                      >
                        {t('singleSystem.toolsAndSoftware.usedForAI')}
                      </Tag>
                    )}
                    {product.apiGatewayUse && (
                      <Tag
                        className="text-base-darker bg-base-lighter margin-bottom-1"
                        key={product.technopediaCategory} // TODO: NJD - need unique key
                      >
                        {t('singleSystem.toolsAndSoftware.apiGateway')}
                      </Tag>
                    )}
                  </Grid>
                </CardHeader>
              </Card>
            );
          })}
        </CardGroup>
      ) : (
        <Alert slim type="info">
          {t('singleSystem.toolsAndSoftware.noToolsOrSoftware')}
        </Alert>
      )}
    </>
  );
};

export default SystemToolsAndSoftware;
