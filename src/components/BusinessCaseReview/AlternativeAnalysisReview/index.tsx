import React, { useState } from 'react';

import ResponsiveTabs from 'components/shared/ResponsiveTabs';
import { hasAlternativeB } from 'data/businessCase';
import {
  BusinessCaseSolution,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import AsIsSolutionReview from 'views/BusinessCase/Review/AsIsSolutionReview';
import ProposedBusinessCaseSolutionReview from 'views/BusinessCase/Review/ProposedBusinessCaseSolutionReview';

type AlternativeAnalysisReviewProps = {
  asIsSolution: BusinessCaseSolution;
  preferredSolution: ProposedBusinessCaseSolution;
  alternativeA: ProposedBusinessCaseSolution;
  alternativeB?: ProposedBusinessCaseSolution;
};

const AlternativeAnalysisReview = (values: AlternativeAnalysisReviewProps) => {
  const {
    asIsSolution,
    preferredSolution,
    alternativeA,
    alternativeB
  } = values;

  const [activeSolutionTab, setActiveSolutionTab] = useState(
    '"As is" solution'
  );

  const getFilledSolutions = () => {
    const solutions = [
      '"As is" solution',
      'Preferred solution',
      'Alternative A'
    ];
    if (alternativeB && hasAlternativeB(alternativeB)) {
      solutions.push('Alternative B');
    }
    return solutions;
  };
  return (
    <ResponsiveTabs
      activeTab={activeSolutionTab}
      tabs={getFilledSolutions()}
      handleTabClick={tab => {
        setActiveSolutionTab(tab);
      }}
    >
      <div
        className="bg-white easi-business-case__review-solutions-wrapper"
        style={{ overflow: 'auto' }}
      >
        {(tab => {
          switch (tab) {
            case '"As is" solution':
              return <AsIsSolutionReview solution={asIsSolution} />;
            case 'Preferred solution':
              return (
                <ProposedBusinessCaseSolutionReview
                  name="Preferred solution"
                  solution={preferredSolution}
                />
              );
            case 'Alternative A':
              return (
                <ProposedBusinessCaseSolutionReview
                  name="Alternative A"
                  solution={alternativeA}
                />
              );
            case 'Alternative B':
              if (alternativeB && hasAlternativeB(alternativeB)) {
                return (
                  <ProposedBusinessCaseSolutionReview
                    name="Alternative B"
                    solution={alternativeB}
                  />
                );
              }
              return null;
            default:
              return <div />;
          }
        })(activeSolutionTab)}
      </div>
    </ResponsiveTabs>
  );
};

export default AlternativeAnalysisReview;
