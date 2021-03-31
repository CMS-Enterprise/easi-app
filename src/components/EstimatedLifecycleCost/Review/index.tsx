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
  data: {
    year1: LifecycleCosts;
    year2: LifecycleCosts;
    year3: LifecycleCosts;
    year4: LifecycleCosts;
    year5: LifecycleCosts;
  };
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

  const sum = (values: number[]): number => {
    return values.reduce(
      (total: number, value: number) => total + (value || 0),
      0
    );
  };

  // Can be float or NaN
  const developmentCosts: { [key: string]: number } = {
    year1: data.year1.development.isPresent
      ? parseFloat(data.year1.development.cost)
      : NaN,
    year2: data.year2.development.isPresent
      ? parseFloat(data.year2.development.cost)
      : NaN,
    year3: data.year3.development.isPresent
      ? parseFloat(data.year3.development.cost)
      : NaN,
    year4: data.year4.development.isPresent
      ? parseFloat(data.year4.development.cost)
      : NaN,
    year5: data.year5.development.isPresent
      ? parseFloat(data.year5.development.cost)
      : NaN
  };

  // Can be float or NaN
  const omCosts: { [key: string]: number } = {
    year1: data.year1.operationsMaintenance.isPresent
      ? parseFloat(data.year1.operationsMaintenance.cost)
      : NaN,
    year2: data.year2.operationsMaintenance.isPresent
      ? parseFloat(data.year2.operationsMaintenance.cost)
      : NaN,
    year3: data.year3.operationsMaintenance.isPresent
      ? parseFloat(data.year3.operationsMaintenance.cost)
      : NaN,
    year4: data.year4.operationsMaintenance.isPresent
      ? parseFloat(data.year4.operationsMaintenance.cost)
      : NaN,
    year5: data.year5.operationsMaintenance.isPresent
      ? parseFloat(data.year5.operationsMaintenance.cost)
      : NaN
  };

  // Can be float or NaN
  const otherCosts: { [key: string]: number } = {
    year1: data.year1.other.isPresent ? parseFloat(data.year1.other.cost) : NaN,
    year2: data.year2.other.isPresent ? parseFloat(data.year2.other.cost) : NaN,
    year3: data.year3.other.isPresent ? parseFloat(data.year3.other.cost) : NaN,
    year4: data.year4.other.isPresent ? parseFloat(data.year4.other.cost) : NaN,
    year5: data.year5.other.isPresent ? parseFloat(data.year5.other.cost) : NaN
  };

  const totalCosts: {
    [key: string]: {
      development: number;
      operationsMaintenance: number;
      other: number;
    };
  } = {
    year1: {
      development: developmentCosts.year1 || 0,
      operationsMaintenance: omCosts.year1 || 0,
      other: otherCosts.year1 || 0
    },
    year2: {
      development: developmentCosts.year2 || 0,
      operationsMaintenance: omCosts.year2 || 0,
      other: otherCosts.year2 || 0
    },
    year3: {
      development: developmentCosts.year3 || 0,
      operationsMaintenance: omCosts.year3 || 0,
      other: otherCosts.year3 || 0
    },
    year4: {
      development: developmentCosts.year4 || 0,
      operationsMaintenance: omCosts.year4 || 0,
      other: otherCosts.year4 || 0
    },
    year5: {
      development: developmentCosts.year5 || 0,
      operationsMaintenance: omCosts.year5 || 0,
      other: otherCosts.year5 || 0
    }
  };

  const totalDevelopmentCosts = sum(Object.values(developmentCosts));
  const totalOmCosts = sum(Object.values(omCosts));
  const totalOtherCosts = sum(Object.values(otherCosts));

  const sumOfTotalCosts =
    totalDevelopmentCosts + totalOmCosts + totalOtherCosts;

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
                        {developmentCosts[year] > 0 && (
                          <tr>
                            <th
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} development costs`}
                            >
                              Development
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollarsOrDash(developmentCosts[year])}
                            </td>
                          </tr>
                        )}
                        {omCosts[year] > 0 && (
                          <tr>
                            <th
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} operations and maintenance costs`}
                            >
                              Operations and Maintenance
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollarsOrDash(omCosts[year])}
                            </td>
                          </tr>
                        )}
                        {otherCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Other
                            </th>
                            <td
                              className="padding-y-2 text-right text-normal"
                              aria-label={`Fiscal year ${yearMapping[year]} other costs`}
                            >
                              {formatDollarsOrDash(otherCosts[year])}
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
                          {formatDollarsOrDash(developmentCosts[year])}
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
                          {formatDollarsOrDash(omCosts[year])}
                        </td>
                      ))}
                      <td className="padding-y-3 text-right">
                        {formatDollarsOrDash(totalOmCosts)}
                      </td>
                    </tr>
                    <tr className="est-lifecycle-cost__border">
                      <TableHead scope="row">Other</TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-other-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollarsOrDash(otherCosts[year])}
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
