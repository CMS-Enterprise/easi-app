import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';

import './index.scss';

const FundingAndBudget = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <>
      <SectionWrapper className="padding-bottom-4">
        <h2 className="margin-top-0 margin-bottom-4">
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
      <SectionWrapper
        borderBottom={isMobile}
        className="margin-bottom-4 padding-bottom-4"
      >
        <CardGroup className="margin-0">
          {system.budgets?.map(
            (budget): React.ReactNode => (
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
    </>
  );
};

export default FundingAndBudget;
