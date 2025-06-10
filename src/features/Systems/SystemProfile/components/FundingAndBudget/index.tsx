import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  Icon,
  Table,
  Tag
  // Grid
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import SectionWrapper from 'components/SectionWrapper';
import { BUDGET_ITEMS_COUNT_CAP } from 'constants/systemProfile';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import formatDollars from 'utils/formatDollars';

import './index.scss';

const FundingAndBudget = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  let budgetItemsLeft = 0;
  const capEnd = isExpanded ? undefined : BUDGET_ITEMS_COUNT_CAP;

  if (system.budgets !== undefined) {
    budgetItemsLeft = system.budgets?.length - BUDGET_ITEMS_COUNT_CAP;
  }

  return (
    <>
      <SectionWrapper>
        <h2 className="margin-top-0 margin-bottom-4">
          {t('singleSystem.fundingAndBudget.header')}
        </h2>
        <Table bordered={false} fullWidth scrollable>
          <thead>
            <tr>
              <th scope="col" className="border-bottom-2px">
                {t('singleSystem.fundingAndBudget.fiscalYear')}
              </th>
              <th scope="col" className="border-bottom-2px">
                {t('singleSystem.fundingAndBudget.actualSystemCost')}
              </th>
              <th scope="col" className="border-bottom-2px">
                {t('singleSystem.fundingAndBudget.budgetedSystemCost')}
              </th>
            </tr>
          </thead>
          <tbody>
            {system.budgetSystemCosts?.budgetActualCost
              .concat()
              .map((budgetRow, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={index}>
                    <td>
                      {budgetRow.fiscalYear
                        ? budgetRow.fiscalYear
                        : t('singleSystem.noDataAvailable')}
                    </td>
                    <td>
                      {budgetRow.actualSystemCost
                        ? formatDollars(
                            Math.trunc(Number(budgetRow.actualSystemCost))
                          )
                        : t('singleSystem.noDataAvailable')}
                    </td>
                    {/* NOTE: There is no way of getting this info given the current status of the CEDAR endpoint but this data could potentially be made avaialble
                              through the API or a future connection with CALM. Talked with UX and made the decision to leave in the column as permanently unavailable */}
                    <td>{t('singleSystem.noDataAvailable')}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        {/* If no system cost info is available, display an alert */}
        {system.budgetSystemCosts?.budgetActualCost === undefined ||
          (system.budgetSystemCosts?.budgetActualCost.length === 0 && (
            <Alert
              headingLevel="h4"
              slim
              type="info"
              data-testid="no-budget-projects-alert"
            >
              {t('singleSystem.fundingAndBudget.noSystemCostInfo')}
            </Alert>
          ))}

        <h2 className="margin-top-4">
          {t('singleSystem.fundingAndBudget.budgetProjects')}
        </h2>
      </SectionWrapper>
      {/* Conditionally render buget project cards or "no budget projects" alert */}
      {system.budgets !== undefined && system.budgets.length > 0 ? (
        <SectionWrapper
          borderBottom={isMobile}
          className="margin-bottom-4 padding-bottom-4"
        >
          <CardGroup>
            {system.budgets?.slice(0, capEnd).map(budget => (
              <Card
                key={budget.id}
                data-testid="budget-project-card"
                className="grid-col-12"
              >
                <CardHeader className="easi-header__basic padding-2 padding-bottom-0 text-top">
                  <dt>
                    {t('singleSystem.fundingAndBudget.budgetID')}
                    {budget.projectId}
                  </dt>
                  {/* Conditionally display fiscal year or "no fiscal year list" message */}
                  {budget.fiscalYear ? (
                    <div>
                      <dd>
                        <Icon.CalendarToday
                          width="1rem"
                          height="1rem"
                          className="margin-right-1"
                          aria-label="calendar today"
                        />
                        {`${t('singleSystem.fundingAndBudget.fiscalYear')} ${
                          budget.fiscalYear
                        }`}
                      </dd>
                    </div>
                  ) : (
                    <div>
                      <dd>
                        <Icon.HelpOutline
                          width="1rem"
                          height="1rem"
                          className="margin-right-1"
                          aria-label="help"
                        />
                        {t('singleSystem.fundingAndBudget.noFiscalYear')}
                      </dd>
                    </div>
                  )}
                </CardHeader>
                <CardBody className="padding-left-2 padding-right-2 padding-top-0 padding-bottom-0">
                  {budget.projectTitle ? (
                    <h3 className="margin-top-0 margin-bottom-1">
                      {budget.projectTitle}
                    </h3>
                  ) : (
                    <h3 className="margin-top-0 margin-bottom-1">
                      {t('singleSystem.fundingAndBudget.noBudgetTitle')}
                    </h3>
                  )}

                  <Grid col className="margin-bottom-2">
                    <DescriptionTerm
                      className="margin-top-1"
                      term={t('singleSystem.fundingAndBudget.fundingSource')}
                    />
                    {/* Condtionally render funding source tag */}
                    {budget.fundingSource ? (
                      <Tag
                        className="text-base-darker bg-base-lighter margin-bottom-1"
                        key="funding-source-tag"
                      >
                        {budget.fundingSource}
                      </Tag>
                    ) : (
                      t('singleSystem.noDataAvailable')
                    )}
                  </Grid>
                  <Divider />
                </CardBody>
                <CardFooter className="padding-2">
                  <DescriptionTerm
                    className="margin-top-1"
                    term={t(
                      'singleSystem.fundingAndBudget.percentageOfFunding'
                    )}
                  />
                  {budget.funding ? (
                    <DescriptionDefinition
                      className="font-body-md line-height-body-4 margin-bottom-2"
                      definition={budget.funding}
                    />
                  ) : (
                    <DescriptionDefinition
                      className="font-body-md line-height-body-4 margin-bottom-2"
                      definition={t('singleSystem.noDataAvailable')}
                    />
                  )}
                </CardFooter>
              </Card>
            ))}
          </CardGroup>
          {budgetItemsLeft > 0 && (
            <Button
              unstyled
              type="button"
              className="line-height-body-5"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded
                ? t('singleSystem.fundingAndBudget.viewLessFunding')
                : t('singleSystem.fundingAndBudget.viewMoreFunding')}
              <Icon.ExpandMore
                aria-label="expand"
                className="margin-left-05 margin-bottom-2px text-tbottom"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : ''
                }}
              />
            </Button>
          )}
        </SectionWrapper>
      ) : (
        <Alert
          headingLevel="h4"
          slim
          type="info"
          data-testid="no-budget-projects-alert"
        >
          {t('singleSystem.fundingAndBudget.noBudgetProjects')}
        </Alert>
      )}
    </>
  );
};

export default FundingAndBudget;
