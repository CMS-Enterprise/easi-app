import React from 'react';
import Media from 'react-media';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import ReviewDesktop from './ReviewDesktop';
import ReviewMobile from './ReviewMobile';

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
  return (
    <Media
      queries={{
        mobile: '(max-width: 768px)',
        desktop: '(min-width: 769px)'
      }}
    >
      {matches => (
        <>
          {matches.mobile && <ReviewMobile data={data} />}
          {matches.desktop && <ReviewDesktop data={data} />}
        </>
      )}
    </Media>
  );
};

export const sumByPhaseType = (items: LifecyclePhase[], phase: string) => {
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

export const sumCosts = (items: LifecyclePhase[]) => {
  return items.reduce((total, current) => {
    if (current.cost) {
      return total + parseFloat(current.cost);
    }
    return total;
  }, 0);
};

export default EstimatedLifecycleCostReview;
