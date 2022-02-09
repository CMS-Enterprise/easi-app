import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardFooter,
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
// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import {
  tempBudgetProp,
  tempCedarSystemProps
} from 'views/Sandbox/mockSystemData';

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
            <SectionWrapper
              borderBottom={isMobile}
              className="padding-bottom-4"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.fundingAndBudget.header')}
              </h2>

              {/* TODO: Map <DescriptionTerm /> to CEDAR data */}
              <Grid row className="margin-top-3">
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.fundingAndBudget.actualFYCost')}
                  />
                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="$4,500,000"
                  />
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.fundingAndBudget.budgetedFYCost')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3 font-body-md"
                    definition="$4,500,000"
                  />
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.fundingAndBudget.investmentNumber')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition="9333"
                  />
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    term={t('singleSystem.fundingAndBudget.requisitionNumber')}
                  />
                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition="OIT-393-2019-0686"
                  />
                </Grid>
              </Grid>

              {/* TODO: Map and populate tags with CEDAR */}
              <h3 className="margin-top-0 margin-bottom-1">
                {t('singleSystem.fundingAndBudget.tagHeader1')}
              </h3>
              <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1">
                Fed Admin
              </Tag>
            </SectionWrapper>
            <SectionWrapper borderBottom={isMobile} className="margin-bottom-5">
              <CardGroup className="margin-0">
                {system?.budgets?.map(
                  (budget: tempBudgetProp): React.ReactNode => (
                    <Card
                      key={budget.id}
                      data-testid="system-card"
                      className="grid-col-12"
                    >
                      <CardHeader className="padding-2 padding-bottom-0 text-top">
                        <dt>
                          {t('singleSystem.fundingAndBudget.budgetID')}
                          {budget.id}
                        </dt>
                        <h3 className="margin-top-0 margin-bottom-1">
                          {budget.title}
                        </h3>
                        <Divider />
                      </CardHeader>
                      <CardFooter className="padding-2">
                        <dt>{budget.comment}</dt>
                      </CardFooter>
                    </Card>
                  )
                )}
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
                  href="/" // TODO: Get link from CEDAR?
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

export default FundingAndBudget;
