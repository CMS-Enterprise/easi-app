import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

type SystemHomeProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const SystemHome = ({ system }: SystemHomeProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');

  return (
    <div id="system-detail">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper
              borderBottom={isMobile}
              className="padding-bottom-4"
            >
              <CardGroup className="margin-0">
                <Card className="grid-col-12">
                  <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                    <dt>Production Environment</dt> {/* TODO: Get from CEDAR */}
                  </CardHeader>

                  <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                    <h2 className="link-header margin-top-0 margin-bottom-2">
                      <UswdsReactLink
                        className="system-profile__card-link"
                        variant="external"
                        to="/"
                      >
                        {/* TODO: Get from CEDAR */}
                        ham.cms.gov
                      </UswdsReactLink>
                    </h2>
                    {system?.locations ? (
                      <div className="margin-bottom-2">
                        <UswdsReactLink
                          className="system-profile__card-link"
                          to="details"
                        >
                          {/* TODO: Get from CEDAR */}
                          View {system.locations.length} more URLs{' '}
                          <span aria-hidden>&nbsp;</span>
                          <span aria-hidden>&rarr; </span>
                        </UswdsReactLink>
                      </div>
                    ) : (
                      ''
                    )}
                    <Divider />
                  </CardBody>
                  <CardFooter className="padding-0">
                    <Grid row>
                      <Grid desktop={{ col: 6 }} className="padding-2">
                        <DescriptionTerm
                          term={t('singleSystem.systemDetails.location')}
                        />
                        <DescriptionDefinition
                          className="line-height-body-3"
                          definition="AWS East" // TODO: Get from CEDAR
                        />
                      </Grid>
                    </Grid>
                  </CardFooter>
                </Card>
                <Card className="grid-col-12">
                  <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                    <dt>{t('singleSystem.ato.atoExpiration')}</dt>
                    <div className="text-right margin-bottom-0">
                      <Tag
                        className={classnames('grid-col-12', {
                          'bg-success-dark': system.atoStatus === 'Active',
                          'bg-warning':
                            system.atoStatus === 'Due Soon' ||
                            system.atoStatus === 'In Progress',
                          'bg-error-dark': system.atoStatus === 'Expired',
                          'bg-base-lighter': system.atoStatus === 'No ATO'
                        })}
                      >
                        {system.atoStatus}
                      </Tag>
                    </div>
                  </CardHeader>

                  <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                    <h2 className="link-header margin-top-0 margin-bottom-2">
                      March 2, 2022 {/* TODO: Get from CEDAR */}
                    </h2>
                    <div className="margin-bottom-2">
                      <UswdsReactLink
                        className="system-profile__card-link"
                        to="ato"
                      >
                        {/* TODO: Get from CEDAR */}
                        View ATO information
                        <span aria-hidden>&nbsp;</span>
                        <span aria-hidden>&rarr; </span>
                      </UswdsReactLink>
                    </div>
                    <Divider />
                  </CardBody>
                  <CardFooter className="padding-0">
                    <Grid row>
                      <Grid desktop={{ col: 6 }} className="padding-2">
                        <DescriptionTerm
                          term={t('singleSystem.ato.currentActivity')}
                        />
                        <DescriptionDefinition
                          className="line-height-body-3"
                          definition="ATO Activity 4" // TODO: Get from CEDAR
                        />
                      </Grid>
                    </Grid>
                  </CardFooter>
                </Card>
              </CardGroup>
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            desktop={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            {/* Setting a ref here to reference the grid width for the fixed side nav */}
            <div className="side-divider">
              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <h3 className="system-profile__subheader margin-bottom-1">
                Geraldine Hobbs
              </h3>
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <Link
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </p>
              <p>
                <Link
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </Link>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemHome;
