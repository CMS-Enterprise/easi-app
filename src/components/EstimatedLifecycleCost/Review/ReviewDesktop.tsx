import React from 'react';
import classnames from 'classnames';
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

const ReviewDesktop = ({ data }: EstimatedLifecycleCostReviewProps) => {
  return (
    <div className="est-lifecycle-cost__review-table-wrapper bg-base-lightest">
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
            <TableData>$1,000,000</TableData>
            <TableData>{formatDollars(20000)}</TableData>
            <TableData>300</TableData>
            <TableData>400</TableData>
            <TableData>500</TableData>
            <TableData>Total</TableData>
          </tr>
          <tr>
            <TableHead scope="row">Operations & Maintanence</TableHead>
            <TableData>100</TableData>
            <TableData>200</TableData>
            <TableData>300</TableData>
            <TableData>400</TableData>
            <TableData>500</TableData>
            <TableData>Total</TableData>
          </tr>
          <tr className="est-lifecycle-cost__border">
            <td />
            <TableData>200</TableData>
            <TableData>400</TableData>
            <TableData>600</TableData>
            <TableData>800</TableData>
            <TableData>1000</TableData>
            <td />
          </tr>
        </tbody>
      </table>
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
