import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  //   Card,
  //   CardBody,
  //   CardGroup,
  //   CardHeader,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
// import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
// import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

import './index.scss';

type FundingAndBudgetProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const FundingAndBudget = ({ system }: FundingAndBudgetProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="funding-and-budget">
      <GridContainer className="padding-left-0 padding-right-0 padding-top-2">
        <Grid row>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper borderBottom className="padding-bottom-4">
              <h2 className="margin-top-0">
                {t('singleSystem.fundingAndBudget.header')}
              </h2>
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
            <div className={classnames('padding-right-2', 'side-divider')}>
              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <DescriptionTerm
                className="system-profile__subheader margin-bottom-1"
                term="Geraldine Hobbs"
              />
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <UswdsReactLink
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  to="/" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </UswdsReactLink>
              </p>
              <p>
                <UswdsReactLink
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  to="/" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </UswdsReactLink>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default FundingAndBudget;
