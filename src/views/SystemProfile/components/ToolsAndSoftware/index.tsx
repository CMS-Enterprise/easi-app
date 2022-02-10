import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

import './index.scss';

type ToolsAndSoftwareProps = {
  className?: string;
  children?: React.ReactNode;
  system: CedarSystemProps;
};

type ProductDataTodo = {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  tags?: string[];
  version: string;
  edition?: string;
};

const productsData: ProductDataTodo[] = [
  {
    id: '1',
    name: 'Drupal',
    manufacturer: 'Drupal Association',
    type: 'Enterprise Content Management (ECM)',
    version: '9.3',
    edition: 'Enterprise'
  },
  {
    id: '2',
    name: 'Kong',
    manufacturer: 'Kong Enterprise',
    type: 'Software Development',
    tags: ['API Gateway'],
    version: '2.1'
  }
];

const pointOfContactData = {
  name: 'Greta May Jones',
  role: 'Business Owner',
  email: 'mailto:todo'
};

const SystemToolsAndSoftware = ({
  className,
  children,
  system
}: ToolsAndSoftwareProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="system-tools-and-software">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <h2 className="margin-top-0 margin-bottom-4">
              {t('singleSystem.toolsAndSoftware.header')}
            </h2>
            <CardGroup className="margin-0">
              {productsData.map(product => {
                return (
                  <Card className="grid-col-12 margin-bottom-2">
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
          </Grid>
          <Grid
            desktop={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            <SectionWrapper
              borderTop={isMobile}
              className={classnames({
                'margin-top-5': isMobile,
                'padding-top-5': isMobile
              })}
            >
              <div className="side-divider">
                <div className="top-divider" />
                <div className="font-body-xs padding-top-1 margin-bottom-3">
                  {t('singleSystem.pointOfContact')}
                </div>
                <h3 className="margin-top-0 margin-bottom-1">
                  {pointOfContactData.name}
                </h3>
                <div className="margin-bottom-1 line-height-body-5">
                  {pointOfContactData.role}
                </div>
                <div className="padding-bottom-3">
                  <Link
                    aria-label={t('singleSystem.sendEmail')}
                    className="line-height-body-5"
                    href={pointOfContactData.email}
                    variant="external"
                    target="_blank"
                  >
                    {t('singleSystem.sendEmail')}
                    <span aria-hidden>&nbsp;</span>
                  </Link>
                </div>
                <div className="padding-bottom-2">
                  <Link
                    aria-label={t('singleSystem.moreContact')}
                    className="line-height-body-5"
                    href="mailto:todo"
                    target="_blank"
                  >
                    {t('singleSystem.moreContact')}
                    <span aria-hidden>&nbsp;</span>
                    <span aria-hidden>&rarr; </span>
                  </Link>
                </div>
              </div>
            </SectionWrapper>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemToolsAndSoftware;
