import React from 'react';
import classnames from 'classnames';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';
import { sumByPhaseType, sumCosts } from './index';

type EstimatedLifecycleCostReviewProps = {
  data: {
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
};

const ReviewDesktop = ({ data }: EstimatedLifecycleCostReviewProps) => {
  const year1initiateCost = sumByPhaseType(data.year1, 'initiate');
  const year2initiateCost = sumByPhaseType(data.year2, 'initiate');
  const year3initiateCost = sumByPhaseType(data.year3, 'initiate');
  const year4initiateCost = sumByPhaseType(data.year4, 'initiate');
  const year5initiateCost = sumByPhaseType(data.year5, 'initiate');
  const totalInitiateCost =
    year1initiateCost +
    year2initiateCost +
    year3initiateCost +
    year4initiateCost +
    year5initiateCost;

  const year1omCost = sumByPhaseType(data.year1, 'om');
  const year2omCost = sumByPhaseType(data.year2, 'om');
  const year3omCost = sumByPhaseType(data.year3, 'om');
  const year4omCost = sumByPhaseType(data.year4, 'om');
  const year5omCost = sumByPhaseType(data.year5, 'om');
  const totalOmCost =
    year1omCost + year2omCost + year3omCost + year4omCost + year5omCost;

  const year1TotalCost = sumCosts(data.year1);
  const year2TotalCost = sumCosts(data.year2);
  const year3TotalCost = sumCosts(data.year3);
  const year4TotalCost = sumCosts(data.year4);
  const year5TotalCost = sumCosts(data.year5);

  return (
    <div>
      <div className="est-lifecycle-cost__review-table-wrapper bg-base-lightest margin-bottom-2">
        <table className="est-lifecycle-cost__review-table">
          <caption className="est-lifecycle-cost__review-table-caption">
            Phase per year breakdown
          </caption>
          <thead>
            <tr className="est-lifecycle-cost__border">
              <td className="est-lifecycle-cost__review-th--row" />
              <TableHead scope="col">Current Year</TableHead>
              <TableHead scope="col">Year 2</TableHead>
              <TableHead scope="col">Year 3</TableHead>
              <TableHead scope="col">Year 4</TableHead>
              <TableHead scope="col">Year 5</TableHead>
              <TableHead scope="col">Total</TableHead>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableHead scope="row">Initiate</TableHead>
              <TableData>{formatDollars(year1initiateCost)}</TableData>
              <TableData>{formatDollars(year2initiateCost)}</TableData>
              <TableData>{formatDollars(year3initiateCost)}</TableData>
              <TableData>{formatDollars(year4initiateCost)}</TableData>
              <TableData>{formatDollars(year5initiateCost)}</TableData>
              <TableData>{formatDollars(totalInitiateCost)}</TableData>
            </tr>
            <tr className="est-lifecycle-cost__border">
              <TableHead scope="row">Operations & Maintenance</TableHead>
              <TableData>{formatDollars(year1omCost)}</TableData>
              <TableData>{formatDollars(year2omCost)}</TableData>
              <TableData>{formatDollars(year3omCost)}</TableData>
              <TableData>{formatDollars(year4omCost)}</TableData>
              <TableData>{formatDollars(year5omCost)}</TableData>
              <TableData>{formatDollars(totalOmCost)}</TableData>
            </tr>
            <tr>
              <td />
              <TableData>{formatDollars(year1TotalCost)}</TableData>
              <TableData>{formatDollars(year2TotalCost)}</TableData>
              <TableData>{formatDollars(year3TotalCost)}</TableData>
              <TableData>{formatDollars(year4TotalCost)}</TableData>
              <TableData>{formatDollars(year5TotalCost)}</TableData>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-base-lightest">
        <DescriptionList title="System Total Cost">
          <DescriptionTerm term="System Total Cost" />
          <DescriptionDefinition
            definition={formatDollars(
              year1TotalCost +
                year2TotalCost +
                year3TotalCost +
                year4TotalCost +
                year5TotalCost
            )}
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
    className={classnames('est-lifecycle-cost__review-th', {
      'est-lifecycle-cost__review-th--col': scope === 'col',
      'est-lifecycle-cost__review-th--row': scope === 'row'
    })}
  >
    {children}
  </th>
);

const TableData = ({ children }: { children?: React.ReactNode }) => (
  <td className="est-lifecycle-cost__review-td">{children}</td>
);

export default ReviewDesktop;
