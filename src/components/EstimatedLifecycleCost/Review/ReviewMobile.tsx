import React from 'react';
import { LifecyclePhase } from 'types/estimatedLifecycle';

type EstimatedLifecycleCostReviewProps = {
  data: {
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
};

const ReviewMobile = ({ data }: EstimatedLifecycleCostReviewProps) => {
  const yearMapping: { [key: string]: string } = {
    year1: 'Current Year',
    year2: 'Year 2',
    year3: 'Year 3',
    year4: 'Year 4',
    year5: 'Year 5'
  };
  return (
    <div className="bg-base-lightest padding-3">
      <p className="est-lifecycle-cost__review-table-caption">
        Phase per year breakdown
      </p>
      {Object.keys(data).map((key: string) => (
        <table className="est-lifecycle-cost__review-table--mobile">
          <caption className="usa-sr-only">{`Cost breakdown for ${yearMapping[key]}`}</caption>
          <tbody>
            <tr>
              <th className="padding-y-2 text-right">{yearMapping[key]}</th>
              <td className="padding-y-2 text-right text-bold">$5000</td>
            </tr>
            <tr>
              <th className="padding-y-2 text-right text-normal">Initiate</th>
              <td className="padding-y-2 text-right text-normal">$5000</td>
            </tr>
            <tr>
              <th className="padding-y-2 text-right text-normal">
                Operations and Maintenance
              </th>
              <td className="padding-y-2 text-right text-normal">$5000</td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default ReviewMobile;
