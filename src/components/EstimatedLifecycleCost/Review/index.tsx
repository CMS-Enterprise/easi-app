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
  const sumByPhaseType = (items: LifecyclePhase[], phase: string) => {
    const phaseMap: { [key: string]: string } = {
      development: 'Development',
      om: 'Operations and Maintenance'
    };

    return items
      .filter(obj => obj.phase === phaseMap[phase])
      .reduce((total, current) => {
        if (current.cost) {
          return total + parseFloat(current.cost);
        }
        return total;
      }, 0);
  };

  const developmentCosts: { [key: string]: any } = {
    year1: sumByPhaseType(data.year1, 'development'),
    year2: sumByPhaseType(data.year2, 'development'),
    year3: sumByPhaseType(data.year3, 'development'),
    year4: sumByPhaseType(data.year4, 'development'),
    year5: sumByPhaseType(data.year5, 'development')
  };

  const omCosts: { [key: string]: any } = {
    year1: sumByPhaseType(data.year1, 'om'),
    year2: sumByPhaseType(data.year2, 'om'),
    year3: sumByPhaseType(data.year3, 'om'),
    year4: sumByPhaseType(data.year4, 'om'),
    year5: sumByPhaseType(data.year5, 'om')
  };

  const totalDevelopmentCosts = Object.values(developmentCosts).reduce(
    (total, cost) => total + cost,
    0
  );
  const totalOmCosts = Object.values(omCosts).reduce(
    (total, cost) => total + cost,
    0
  );

  const totalCosts: { [key: string]: number } = {
    year1: developmentCosts.year1 + omCosts.year1,
    year2: developmentCosts.year2 + omCosts.year2,
    year3: developmentCosts.year3 + omCosts.year3,
    year4: developmentCosts.year4 + omCosts.year4,
    year5: developmentCosts.year5 + omCosts.year5
  };

  return (
    <div>
      {totalDevelopmentCosts + totalOmCosts === 0 && (
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
                  'margin-bottom-2',
                  {
                    'est-lifecycle-cost__review-table--blur':
                      totalDevelopmentCosts + totalOmCosts === 0
                  }
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
                            {formatDollars(totalCosts[year])}
                          </td>
                        </tr>
                        {developmentCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Development
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollars([developmentCosts[year]])}
                            </td>
                          </tr>
                        )}
                        {omCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Operations and Maintenance
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollars(omCosts[year])}
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
                <table
                  className={classnames('est-lifecycle-cost__review-table', {
                    'est-lifecycle-cost__review-table--blur':
                      totalDevelopmentCosts + totalOmCosts === 0
                  })}
                >
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
                          key={`${year}-developmentcosts`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollars(developmentCosts[year])}
                        </td>
                      ))}
                      <td
                        data-testid="total-development-costs"
                        className="padding-y-3 text-right"
                      >
                        {formatDollars(totalDevelopmentCosts)}
                      </td>
                    </tr>
                    <tr className="est-lifecycle-cost__border">
                      <TableHead scope="row">
                        Operations and Maintenance
                      </TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-om-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollars(omCosts[year])}
                        </td>
                      ))}
                      <td className="padding-y-3 text-right">
                        {formatDollars(totalOmCosts)}
                      </td>
                    </tr>
                    <tr>
                      <td />
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollars(totalCosts[year])}
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
            definition={formatDollars(totalDevelopmentCosts + totalOmCosts)}
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
