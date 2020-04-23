import React, { useState } from 'react';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';
import { sumByPhaseType } from './index';

type EstimatedLifecycleCostReviewProps = {
  data: {
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
};

type PossibleYears = 'year1' | 'year2' | 'year3' | 'year4' | 'year5';

const ReviewMobile = ({ data }: any) => {
  const [total, setTotal] = useState(0);
  const yearMapping: any = {
    year1: 'Current Year',
    year2: 'Year 2',
    year3: 'Year 3',
    year4: 'Year 4',
    year5: 'Year 5'
  };

  return (
    <div>
      <div className="bg-base-lightest padding-3">
        <p className="est-lifecycle-cost__review-table-caption">
          Phase per year breakdown
        </p>
        {Object.keys(data).map((key: any) => {
          const initiateCost = sumByPhaseType(data[key], 'initiate');
          const opsMaintenanceCost = sumByPhaseType(data[key], 'om');
          const totalCost = initiateCost + opsMaintenanceCost;
          setTotal(prev => prev + totalCost);
          return (
            <table
              key={key}
              className="est-lifecycle-cost__review-table--mobile"
            >
              <caption className="usa-sr-only">{`Cost breakdown for ${yearMapping[key]}`}</caption>
              <tbody>
                <tr>
                  <th className="padding-y-2 text-right">{yearMapping[key]}</th>
                  <td className="padding-y-2 text-right text-bold">
                    {formatDollars(totalCost)}
                  </td>
                </tr>
                {initiateCost > 0 && (
                  <tr>
                    <th className="padding-y-2 text-right text-normal">
                      Initiate
                    </th>
                    <td className="padding-y-2 text-right text-normal">
                      {formatDollars(initiateCost)}
                    </td>
                  </tr>
                )}
                {opsMaintenanceCost > 0 && (
                  <tr>
                    <th className="padding-y-2 text-right text-normal">
                      Operations and Maintenance
                    </th>
                    <td className="padding-y-2 text-right text-normal">
                      {formatDollars(opsMaintenanceCost)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        })}
      </div>

      <div className="bg-base-lightest">
        <DescriptionList title="System Total Cost">
          <DescriptionTerm term="System Total Cost" />
          <DescriptionDefinition definition={formatDollars(total)} />
        </DescriptionList>
      </div>
    </div>
  );
};

export default ReviewMobile;
