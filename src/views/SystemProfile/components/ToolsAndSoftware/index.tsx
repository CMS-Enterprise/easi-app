import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import Tag from 'components/shared/Tag';

import { SystemProfileSubComponentProps } from '..';

// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import './index.scss';

const SystemToolsAndSoftware = ({ system }: SystemProfileSubComponentProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <>
      <h2 className="margin-top-0 margin-bottom-4">
        {t('singleSystem.toolsAndSoftware.header')}
      </h2>
      <CardGroup className="margin-0">
        {system?.products?.map(product => {
          return (
            <Card key={product.id} className="grid-col-12 margin-bottom-2">
              <CardHeader className="padding-2 padding-bottom-0">
                <h3 className="margin-top-0 margin-bottom-05 line-height-sans-2">
                  {product.name}
                </h3>
                <h5 className="margin-top-0 margin-bottom-2 font-sans-xs line-height-sans-1 text-normal">
                  {product.manufacturer}
                </h5>
              </CardHeader>
              <CardBody className="padding-2 padding-top-0">
                <DescriptionTerm
                  className="margin-bottom-0"
                  term={t('singleSystem.toolsAndSoftware.productType')}
                />
                <DescriptionDefinition
                  className="font-body-md line-height-body-4"
                  definition={product.type}
                />
                {product.tags && product.tags.length && (
                  <div className="margin-top-2 margin-bottom-neg-1">
                    {product.tags.map(name => (
                      <Tag
                        key={name}
                        className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                      >
                        {name}
                      </Tag>
                    ))}
                  </div>
                )}
                <Divider className="margin-y-2" />
                <GridContainer className="padding-x-0">
                  <Grid row gap>
                    <Grid col>
                      <DescriptionTerm
                        className="margin-bottom-0"
                        term={t(
                          'singleSystem.toolsAndSoftware.softwareVersion'
                        )}
                      />
                      <DescriptionDefinition
                        className="font-body-md line-height-body-4"
                        definition={product.version}
                      />
                    </Grid>
                    {product.edition && (
                      <Grid col>
                        <DescriptionTerm
                          className="margin-bottom-0"
                          term={t(
                            'singleSystem.toolsAndSoftware.softwareEdition'
                          )}
                        />
                        <DescriptionDefinition
                          className="font-body-md line-height-body-4"
                          definition={product.edition}
                        />
                      </Grid>
                    )}
                  </Grid>
                </GridContainer>
              </CardBody>
            </Card>
          );
        })}
      </CardGroup>
    </>
  );
};

export default SystemToolsAndSoftware;
