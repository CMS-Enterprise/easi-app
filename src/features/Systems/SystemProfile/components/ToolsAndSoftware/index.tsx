import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardGroup,
  CardHeader,
  Grid,
  Icon
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Tag from 'components/Tag';
import { TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP } from 'constants/systemProfile';
import { SystemProfileSubviewProps } from 'types/systemProfile';

import './index.scss';

const SystemToolsAndSoftware = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  let productsLeft = 0;
  const capEnd = isExpanded ? undefined : TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP;

  if (system.toolsAndSoftware?.softwareProducts !== undefined) {
    productsLeft =
      system.toolsAndSoftware?.softwareProducts.length -
      TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP;
  }

  return (
    <div id="system-tools-and-software">
      <h2 className="margin-top-0 margin-bottom-4">
        {t('singleSystem.toolsAndSoftware.header')}
      </h2>
      {system.toolsAndSoftware?.softwareProducts !== undefined &&
      system.toolsAndSoftware?.softwareProducts.length > 0 ? (
        <>
          <CardGroup className="margin-0">
            {system.toolsAndSoftware?.softwareProducts
              .slice(0, capEnd)
              .map(product => {
                return (
                  <Card
                    key={product.systemSoftwareConnectionGuid}
                    className="grid-col-12 margin-bottom-2"
                    data-testid="software-product-card"
                  >
                    <CardHeader className="padding-2 padding-bottom-1">
                      <h3 className="margin-top-0 margin-bottom-1 line-height-sans-2">
                        {product.softwareName}
                      </h3>
                      {product.vendorName ? (
                        <>{product.vendorName}</>
                      ) : (
                        <>
                          {t(
                            'singleSystem.toolsAndSoftware.noManufacturerListed'
                          )}
                        </>
                      )}
                      {product.elaPurchase === 'Yes' && (
                        <div className="margin-left-05 margin-top-05">
                          <span>$ &nbsp;</span>
                          <span className="text-base-dark">
                            {t('singleSystem.toolsAndSoftware.elaPurchase')}
                          </span>
                        </div>
                      )}
                      <Grid col>
                        <DescriptionTerm
                          className="margin-top-1"
                          term={t(
                            'singleSystem.toolsAndSoftware.productCategory'
                          )}
                        />
                        <DescriptionDefinition
                          className="font-body-md line-height-body-4 margin-bottom-1"
                          definition={product.technopediaCategory}
                        />
                        {/* Condtionally render software product tags
                        TODO: break this out into separate function? */}
                        {product.providesAiCapability && (
                          <Tag
                            className="text-base-darker bg-base-lighter margin-bottom-1"
                            key="provides-ai-capability-tag"
                          >
                            {t('singleSystem.toolsAndSoftware.usedForAI')}
                          </Tag>
                        )}
                        {product.apiGatewayUse && (
                          <Tag
                            className="text-base-darker bg-base-lighter margin-bottom-1"
                            key="used-as-api-gateway-tag"
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
          {productsLeft > 0 && (
            <Button
              unstyled
              type="button"
              className="line-height-body-5"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              {t(
                `singleSystem.toolsAndSoftware.view${
                  isExpanded ? 'Less' : 'More'
                }`,
                {
                  count: productsLeft
                }
              )}
              <Icon.ExpandMore
                className="margin-left-05 margin-bottom-2px text-tbottom"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : ''
                }}
              />
            </Button>
          )}
        </>
      ) : (
        <Alert
          headingLevel="h4"
          slim
          type="info"
          data-testid="no-software-products-alert"
        >
          {t('singleSystem.toolsAndSoftware.noToolsOrSoftware')}
        </Alert>
      )}
    </div>
  );
};

export default SystemToolsAndSoftware;
