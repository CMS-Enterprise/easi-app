import React from 'react';
import Media from 'react-media';
import classnames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';

type EstimatedLifecycleCostReviewProps = {
  fiscalYear: number;
  data: LifecycleCosts;
};

const EstimatedLifecycleCostReview = ({
  fiscalYear,
  data
}: EstimatedLifecycleCostReviewProps) => {
  const yearMapping: { [key: string]: string } = {
    year1: String(fiscalYear),
    year2: String(fiscalYear + 1),
    year3: String(fiscalYear + 2),
    year4: String(fiscalYear + 3),
    year5: String(fiscalYear + 4)
  };

  const formatDollarsOrDash = (value: number): string => {
    if (Number.isNaN(value)) {
      return '-';
    }
    return formatDollars(value);
  };

  const sum = (values: string[]): number => {
    return values.reduce((total: number, value: string) => {
      const currentValue = value ? parseFloat(value) : 0;
      return total + (currentValue || 0);
    }, 0);
  };

  // Can be float or NaN
  // const data.development.years: { [key: string]: number } = {
  //   year1: data.year1.development.isPresent
  //     ? parseFloat(data.year1.development.cost)
  //     : NaN,
  //   year2: data.year2.development.isPresent
  //     ? parseFloat(data.year2.development.cost)
  //     : NaN,
  //   year3: data.year3.development.isPresent
  //     ? parseFloat(data.year3.development.cost)
  //     : NaN,
  //   year4: data.year4.development.isPresent
  //     ? parseFloat(data.year4.development.cost)
  //     : NaN,
  //   year5: data.year5.development.isPresent
  //     ? parseFloat(data.year5.development.cost)
  //     : NaN
  // };

  // Can be float or NaN
  // const data.operationsMaintenance.years: { [key: string]: number } = {
  //   year1: data.year1.operationsMaintenance.isPresent
  //     ? parseFloat(data.year1.operationsMaintenance.cost)
  //     : NaN,
  //   year2: data.year2.operationsMaintenance.isPresent
  //     ? parseFloat(data.year2.operationsMaintenance.cost)
  //     : NaN,
  //   year3: data.year3.operationsMaintenance.isPresent
  //     ? parseFloat(data.year3.operationsMaintenance.cost)
  //     : NaN,
  //   year4: data.year4.operationsMaintenance.isPresent
  //     ? parseFloat(data.year4.operationsMaintenance.cost)
  //     : NaN,
  //   year5: data.year5.operationsMaintenance.isPresent
  //     ? parseFloat(data.year5.operationsMaintenance.cost)
  //     : NaN
  // };

  // Can be float or NaN
  // const data.other.years: { [key: string]: number } = {
  //   year1: data.year1.other.isPresent ? parseFloat(data.year1.other.cost) : NaN,
  //   year2: data.year2.other.isPresent ? parseFloat(data.year2.other.cost) : NaN,
  //   year3: data.year3.other.isPresent ? parseFloat(data.year3.other.cost) : NaN,
  //   year4: data.year4.other.isPresent ? parseFloat(data.year4.other.cost) : NaN,
  //   year5: data.year5.other.isPresent ? parseFloat(data.year5.other.cost) : NaN
  // };

  // const totalCosts: {
  //   [key: string]: {
  //     development: number;
  //     operationsMaintenance: number;
  //     other: number;
  //   };
  // } = {
  //   year1: {
  //     development: data.development.years.year1 || 0,
  //     operationsMaintenance: data.operationsMaintenance.years.year1 || 0,
  //     other: data.other.years.year1 || 0
  //   },
  //   year2: {
  //     development: data.development.years.year2 || 0,
  //     operationsMaintenance: data.operationsMaintenance.years.year2 || 0,
  //     other: data.other.years.year2 || 0
  //   },
  //   year3: {
  //     development: data.development.years.year3 || 0,
  //     operationsMaintenance: data.operationsMaintenance.years.year3 || 0,
  //     other: data.other.years.year3 || 0
  //   },
  //   year4: {
  //     development: data.development.years.year4 || 0,
  //     operationsMaintenance: data.operationsMaintenance.years.year4 || 0,
  //     other: data.other.years.year4 || 0
  //   },
  //   year5: {
  //     development: data.development.years.year5 || 0,
  //     operationsMaintenance: data.operationsMaintenance.years.year5 || 0,
  //     other: data.other.years.year5 || 0
  //   }
  // };

  const totalCosts = Object.keys(data).reduce(
    (acc, cost) => {
      const { years } = data[cost as keyof LifecycleCosts];
      return {
        year1: { ...acc.year1, [cost]: years.year1 },
        year2: { ...acc.year2, [cost]: years.year2 },
        year3: { ...acc.year2, [cost]: years.year3 },
        year4: { ...acc.year2, [cost]: years.year4 },
        year5: { ...acc.year2, [cost]: years.year5 }
      };
    },
    { year1: {}, year2: {}, year3: {}, year4: {}, year5: {} }
  );

  const totalDevelopmentCosts = sum(Object.values(data.development.years));
  const totalOperationsMaintenanceCosts = sum(
    Object.values(data.operationsMaintenance.years)
  );
  const totalOtherCosts = sum(Object.values(data.other.years));

  const sumOfTotalCosts =
    totalDevelopmentCosts + totalOperationsMaintenanceCosts + totalOtherCosts;

  return (
    <div>
      {sumOfTotalCosts === 0 && (
        <DescriptionTerm term="Requester indicated there is no associated cost with this solution" />
      )}
      <Media
        queries={{
          mobile: '(max-width: 768px)',
          desktop: '(min-width: 769px)'
        }}
      >
        {matches => (
          <>
            {matches.mobile && (
              <div
                data-testid="est-lifecycle--mobile"
                className={classnames(
                  'bg-base-lightest',
                  'padding-3',
                  'margin-bottom-2'
                )}
              >
                <p className="est-lifecycle-cost__review-table-caption">
                  Phase per year breakdown
                </p>
                {Object.keys(data).map((year: any) => {
                  return (
                    <table
                      key={year}
                      className="est-lifecycle-cost__review-table est-lifecycle-cost__review-table--mobile"
                    >
                      <caption className="usa-sr-only">{`Cost breakdown for fiscal year ${yearMapping[year]}`}</caption>
                      <tbody>
                        <tr>
                          <th
                            className="padding-y-2 text-right"
                            aria-label={`Fiscal year ${yearMapping[year]}`}
                          >
                            {`FY ${yearMapping[year]}`}
                          </th>
                          <td className="padding-y-2 text-right text-bold">
                            {formatDollarsOrDash(
                              sum(Object.values(totalCosts[year]))
                            )}
                          </td>
                        </tr>
                        {data.development.years[year] > 0 && (
                          <tr>
                            <th
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} development costs`}
                            >
                              Development
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollarsOrDash(
                                data.development.years[year]
                              )}
                            </td>
                          </tr>
                        )}
                        {data.operationsMaintenance.years[year] > 0 && (
                          <tr>
                            <th
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} operations and maintenance costs`}
                            >
                              Operations and Maintenance
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollarsOrDash(
                                data.operationsMaintenance.years[year]
                              )}
                            </td>
                          </tr>
                        )}
                        {data.other.years[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Other
                            </th>
                            <td
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} other costs`}
                            >
                              {formatDollarsOrDash(data.other.years[year])}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  );
                })}
              </div>
            )}

            {matches.desktop && (
              <div
                data-testid="est-lifecycle--desktop"
                className="est-lifecycle-cost__review-table-wrapper bg-base-lightest margin-bottom-2"
              >
                <table className="est-lifecycle-cost__review-table">
                  <caption className="est-lifecycle-cost__review-table-caption">
                    Phase per year breakdown
                  </caption>
                  <thead>
                    <tr className="est-lifecycle-cost__border">
                      <td className="est-lifecycle-cost__review-th--row" />
                      {Object.keys(yearMapping).map(year => (
                        <TableHead
                          key={`${year}-label`}
                          scope="col"
                          aria-label={`Fiscal Year ${yearMapping[year]}`}
                        >
                          {`FY ${yearMapping[year]}`}
                        </TableHead>
                      ))}
                      <TableHead scope="col">Total</TableHead>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <TableHead scope="row">Development</TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-development-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollarsOrDash(data.development.years[year])}
                        </td>
                      ))}
                      <td
                        data-testid="total-development-costs"
                        className="padding-y-3 text-right"
                      >
                        {formatDollarsOrDash(totalDevelopmentCosts)}
                      </td>
                    </tr>
                    <tr>
                      <TableHead scope="row">
                        Operations and Maintenance
                      </TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-om-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollarsOrDash(
                            data.operationsMaintenance.years[year]
                          )}
                        </td>
                      ))}
                      <td className="padding-y-3 text-right">
                        {formatDollarsOrDash(totalOperationsMaintenanceCosts)}
                      </td>
                    </tr>
                    <tr className="est-lifecycle-cost__border">
                      <TableHead scope="row">Other</TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-other-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollarsOrDash(data.other.years[year])}
                        </td>
                      ))}
                      <td className="padding-y-3 text-right">
                        {formatDollarsOrDash(totalOtherCosts)}
                      </td>
                    </tr>
                    <tr>
                      <td />
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollarsOrDash(
                            sum(Object.values(totalCosts[year]))
                          )}
                        </td>
                      ))}
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Media>
      <div className="est-lifecycle-cost__total bg-base-lightest overflow-auto padding-x-2">
        <DescriptionList title="System total cost">
          <DescriptionTerm term="System total cost" />
          <DescriptionDefinition
            definition={formatDollarsOrDash(sumOfTotalCosts)}
          />
        </DescriptionList>
      </div>
    </div>
  );
};

const TableHead = ({
  scope,
  children,
  ...props
}: {
  scope: 'row' | 'col';
  children: React.ReactNode;
}) => (
  <th
    scope={scope}
    className={classnames('text-bold', 'text-right', {
      'est-lifecycle-cost__review-th--col': scope === 'col',
      'est-lifecycle-cost__review-th--row': scope === 'row'
    })}
    {...props}
  >
    {children}
  </th>
);

export default EstimatedLifecycleCostReview;
