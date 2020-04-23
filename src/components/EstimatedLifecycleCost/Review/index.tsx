import React from 'react';
import classnames from 'classnames';
import Media from 'react-media';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
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
    year1: 'Current Year',
    year2: 'Year 2',
    year3: 'Year 3',
    year4: 'Year 4',
    year5: 'Year 5'
  };
  const sumByPhaseType = (items: LifecyclePhase[], phase: string) => {
    const phaseMap: { [key: string]: string } = {
      initiate: 'Initiate',
      om: 'Operations & Maintenance'
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

  const initiateCosts: { [key: string]: any } = {
    year1: sumByPhaseType(data.year1, 'initiate'),
    year2: sumByPhaseType(data.year2, 'initiate'),
    year3: sumByPhaseType(data.year3, 'initiate'),
    year4: sumByPhaseType(data.year4, 'initiate'),
    year5: sumByPhaseType(data.year5, 'initiate')
  };

  const omCosts: { [key: string]: any } = {
    year1: sumByPhaseType(data.year1, 'om'),
    year2: sumByPhaseType(data.year2, 'om'),
    year3: sumByPhaseType(data.year3, 'om'),
    year4: sumByPhaseType(data.year4, 'om'),
    year5: sumByPhaseType(data.year5, 'om')
  };

  const totalInitiateCosts = Object.values(initiateCosts).reduce(
    (total, cost) => total + cost,
    0
  );
  const totalOmCosts = Object.values(omCosts).reduce(
    (total, cost) => total + cost,
    0
  );

  const totalCosts: { [key: string]: number } = {
    year1: initiateCosts.year1 + omCosts.year1,
    year2: initiateCosts.year2 + omCosts.year2,
    year3: initiateCosts.year3 + omCosts.year3,
    year4: initiateCosts.year4 + omCosts.year4,
    year5: initiateCosts.year5 + omCosts.year5
  };

  return (
    <div>
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
                className="bg-base-lightest padding-3 margin-bottom-2"
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
                        {initiateCosts[year] > 0 && (
                          <tr>
                            <th className="padding-y-2 text-right text-normal">
                              Initiate
                            </th>
                            <td className="padding-y-2 text-right text-normal">
                              {formatDollars([initiateCosts[year]])}
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
                      <TableHead scope="row">Initiate</TableHead>
                      {Object.keys(yearMapping).map(year => (
                        <td
                          key={`${year}-initiate-costs`}
                          className="padding-y-3 text-right"
                        >
                          {formatDollars(initiateCosts[year])}
                        </td>
                      ))}
                      <td
                        data-testid="total-initiate-costs"
                        className="padding-y-3 text-right"
                      >
                        {formatDollars(totalInitiateCosts)}
                      </td>
                    </tr>
                    <tr className="est-lifecycle-cost__border">
                      <TableHead scope="row">
                        Operations & Maintenance
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
      <div className="bg-base-lightest overflow-auto padding-x-2">
        <DescriptionList title="System Total Cost">
          <DescriptionTerm term="System Total Cost" />
          <DescriptionDefinition
            definition={formatDollars(totalInitiateCosts + totalOmCosts)}
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
  children?: React.ReactNode;
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
