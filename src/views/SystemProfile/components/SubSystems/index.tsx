import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  IconBookmark,
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
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import './index.scss';

type SubSystemsProps = {
  system: tempCedarSystemProps;
};

const pointOfContactDataTodo = {
  name: 'Geraldine Hobbs',
  role: 'Business Owner',
  email: 'mailto:todo'
};

const SystemSubSystems = ({ system }: SubSystemsProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="system-sub-systems">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <h2 className="margin-top-0 margin-bottom-4">
              {t('singleSystem.subSystems.header')}
            </h2>
            <CardGroup className="margin-0">
              {system?.subSystems?.map(sub => {
                return (
                  <Card key={sub.id} className="grid-col-12 margin-bottom-2">
                    <CardHeader className="padding-2 padding-bottom-0">
                      <div className="display-flex margin-bottom-105">
                        <div className="flex-fill">
                          <h3 className="margin-y-0 line-height-body-2">
                            <UswdsReactLink to="todo">
                              {sub.name}
                            </UswdsReactLink>
                          </h3>
                        </div>
                        <div className="flex-auto">
                          <IconBookmark
                            size={6}
                            className="bookmark__icon padding-y-05 padding-x-1"
                          />
                        </div>
                      </div>
                      <div className="margin-top-0 margin-bottom-2 font-sans-xs line-height-body-1">
                        {sub.acronym}
                      </div>
                    </CardHeader>
                    <CardBody className="padding-2">
                      <div>{sub.description}</div>
                      <Divider className="margin-y-2" />
                      <DescriptionTerm
                        className="margin-bottom-05 font-body-xs line-height-body-1 text-normal"
                        term={t('singleSystem.subSystems.retirementDate')}
                      />
                      <DescriptionDefinition
                        className="font-body-md line-height-body-4 text-bold"
                        definition={sub.retirementDate}
                      />
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
                  {pointOfContactDataTodo.name}
                </h3>
                <div className="margin-bottom-1 line-height-body-5">
                  {pointOfContactDataTodo.role}
                </div>
                <div className="padding-bottom-3">
                  <Link
                    aria-label={t('singleSystem.sendEmail')}
                    className="line-height-body-5"
                    href={pointOfContactDataTodo.email}
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

export default SystemSubSystems;
