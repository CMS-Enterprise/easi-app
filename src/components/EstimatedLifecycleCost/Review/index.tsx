import React from 'react';
import Media from 'react-media';
import classnames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import { LifecycleCosts, LifecycleYears } from 'types/estimatedLifecycle';
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

  const totalCosts = Object.keys(data).reduce(
    (acc, cost) => {
      const { years } = data[cost as keyof LifecycleCosts];
      return {
        year1: { ...acc.year1, [cost]: years.year1 },
        year2: { ...acc.year2, [cost]: years.year2 },
        year3: { ...acc.year3, [cost]: years.year3 },
        year4: { ...acc.year4, [cost]: years.year4 },
        year5: { ...acc.year5, [cost]: years.year5 }
      };
    },
    { year1: {}, year2: {}, year3: {}, year4: {}, year5: {} }
  );

  const sumOfTotalCosts = Object.keys(data).reduce((acc, cost) => {
    return acc + sum(Object.values(data[cost as keyof LifecycleCosts].years));
  }, 0);

  return (
    <div className="margin-y-1">
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
                {Object.keys(totalCosts).map((year: any) => {
                  return (
                    <table
                      key={year}
                      className="est-lifecycle-cost__review-table est-lifecycle-cost__review-table--mobile"
                    >
                      <caption className="usa-sr-only">{`Cost breakdown for fiscal year ${yearMapping[year]}`}</caption>
                      <tbody>
                        <tr>
                          <th
                            className="padding-y-2 text-left"
                            aria-label={`Fiscal year ${yearMapping[year]}`}
                          >
                            {`FY ${yearMapping[year]}`}
                          </th>
                          <td className="padding-y-2 text-bold text-right">
                            {formatDollarsOrDash(
                              sum(
                                Object.values(
                                  totalCosts[year as keyof LifecycleYears]
                                )
                              )
                            )}
                          </td>
                        </tr>
                        {Object.keys(data)
                          .filter(
                            cost =>
                              data[cost as keyof LifecycleCosts].type ===
                                'primary' ||
                              data[cost as keyof LifecycleCosts].isPresent
                          )
                          .map(cost => (
                            <tr key={cost}>
                              <th
                                className="padding-y-2 text-normal text-left"
                                aria-label={`Fiscal year ${yearMapping[year]} ${
                                  data[cost as keyof LifecycleCosts].label
                                } costs`}
                              >
                                {data[cost as keyof LifecycleCosts].label}
                              </th>
                              <td className="padding-y-2 text-normal text-right">
                                {formatDollarsOrDash(
                                  parseFloat(
                                    data[cost as keyof LifecycleCosts].years[
                                      year as keyof LifecycleYears
                                    ]
                                  )
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  );
                })}
              </div>
            )}

            {matches.desktop && (
              <div
                data-testid="est-lifecycle--desktop"
                className="est-lifecycle-cost__review-table-wrapper bg-base-lightest margin-bottom-2 padding-top-2 padding-bottom-1"
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
                    {Object.keys(data)
                      .filter(
                        cost =>
                          data[cost as keyof LifecycleCosts].type ===
                            'primary' ||
                          data[cost as keyof LifecycleCosts].isPresent
                      )
                      .map(cost => (
                        <tr key={cost}>
                          <TableHead scope="row">
                            {data[cost as keyof LifecycleCosts].label}
                          </TableHead>
                          {Object.keys(yearMapping).map(year => (
                            <td
                              key={`${year}-${cost}-costs`}
                              className="padding-y-3 padding-x-2"
                            >
                              {formatDollarsOrDash(
                                parseFloat(
                                  data[cost as keyof LifecycleCosts].years[
                                    year as keyof LifecycleYears
                                  ]
                                )
                              )}
                            </td>
                          ))}
                          <td
                            data-testid={`total-${cost}-costs`}
                            className="padding-y-3 padding-x-2"
                          >
                            {formatDollarsOrDash(
                              sum(
                                Object.values(
                                  data[cost as keyof LifecycleCosts].years
                                )
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td />
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-costs`}
                          className="padding-y-3 padding-x-2"
                        >
                          {formatDollarsOrDash(
                            sum(
                              Object.values(
                                totalCosts[year as keyof LifecycleYears]
                              )
                            )
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
    className={classnames('text-bold', 'text-left', {
      'est-lifecycle-cost__review-th--col padding-x-2': scope === 'col',
      'est-lifecycle-cost__review-th--row padding-right-2': scope === 'row'
    })}
    {...props}
  >
    {children}
  </th>
);

export default EstimatedLifecycleCostReview;
