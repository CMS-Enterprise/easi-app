import React from 'react';
import Media from 'react-media';
import classnames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';

type EstimatedLifecycleCostReviewProps = {
  data: {
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
};

const EstimatedLifecycleCostReview = ({
  data
}: EstimatedLifecycleCostReviewProps) => {
  const yearMapping: { [key: string]: string } = {
    year1: 'Year 1',
    year2: 'Year 2',
    year3: 'Year 3',
    year4: 'Year 4',
    year5: 'Year 5'
  };
  const costForPhase = (items: LifecyclePhase[], phaseID: string) => {
    const phaseMap: { [key: string]: string } = {
      development: 'Development',
      om: 'Operations and Maintenance',
      other: 'Other'
    };

    const phase = items.find(obj => obj.phase === phaseMap[phaseID]);
    if (phase) {
      return parseFloat(phase.cost);
    }
    return undefined;
  };

  const formatDollarsOrDash = (value: number | undefined): string => {
    if (typeof value === 'undefined') {
      return '-';
    }
    return formatDollars(value);
  };

  const sum = (values: (number | undefined)[]): number => {
    return values.reduce(
      (total: number, value: number | undefined) => total + (value || 0),
      0
    );
  };

  const developmentCosts: { [key: string]: number | undefined } = {
    year1: costForPhase(data.year1, 'development'),
    year2: costForPhase(data.year2, 'development'),
    year3: costForPhase(data.year3, 'development'),
    year4: costForPhase(data.year4, 'development'),
    year5: costForPhase(data.year5, 'development')
  };

  const omCosts: { [key: string]: number | undefined } = {
    year1: costForPhase(data.year1, 'om'),
    year2: costForPhase(data.year2, 'om'),
    year3: costForPhase(data.year3, 'om'),
    year4: costForPhase(data.year4, 'om'),
    year5: costForPhase(data.year5, 'om')
  };

  const otherCosts: { [key: string]: any } = {
    year1: costForPhase(data.year1, 'other'),
    year2: costForPhase(data.year2, 'other'),
    year3: costForPhase(data.year3, 'other'),
    year4: costForPhase(data.year4, 'other'),
    year5: costForPhase(data.year5, 'other')
  };

  const totalCosts: { [key: string]: number } = {
    year1: sum([developmentCosts.year1, omCosts.year1, otherCosts.year1]),
    year2: sum([developmentCosts.year2, omCosts.year2, otherCosts.year2]),
    year3: sum([developmentCosts.year3, omCosts.year3, otherCosts.year3]),
    year4: sum([developmentCosts.year4, omCosts.year4, otherCosts.year4]),
    year5: sum([developmentCosts.year5, omCosts.year5, otherCosts.year5])
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
                      <caption className="usa-sr-only">{`Cost breakdown for ${yearMapping[year]}`}</caption>
                      <tbody>
                        <tr>
                          <th className="padding-y-2 text-right">
                            {yearMapping[year]}
                          </th>
                          <td className="padding-y-2 text-right text-bold">
                            {formatDollarsOrDash(totalCosts[year])}
                          </td>
                        </tr>
                        {developmentCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Development
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollarsOrDash([developmentCosts[year]])}
                            </td>
                          </tr>
                        )}
                        {omCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
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
                            <td className="padding-y-2 text-right text-normal">
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
                        <TableHead key={`${year}-label`} scope="col">
                          {yearMapping[year]}
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
                          {formatDollarsOrDash(totalCosts[year])}
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
  children
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
  >
    {children}
  </th>
);

export default EstimatedLifecycleCostReview;
