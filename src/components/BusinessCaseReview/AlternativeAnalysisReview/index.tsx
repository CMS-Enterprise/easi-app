import React, { useState } from 'react';

import PrintableTabContent from 'components/PrintableTabContent';
import ResponsiveTabs from 'components/shared/ResponsiveTabs';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
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
    if (alternativeB && alternativeSolutionHasFilledFields(alternativeB)) {
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
        <PrintableTabContent visible={activeSolutionTab === '"As is" solution'}>
          <AsIsSolutionReview solution={asIsSolution} />
        </PrintableTabContent>

        <PrintableTabContent
          visible={activeSolutionTab === 'Preferred solution'}
        >
          <ProposedBusinessCaseSolutionReview
            name="Preferred solution"
            solution={preferredSolution}
          />
        </PrintableTabContent>

        <PrintableTabContent visible={activeSolutionTab === 'Alternative A'}>
          <ProposedBusinessCaseSolutionReview
            name="Alternative A"
            solution={alternativeA}
          />
        </PrintableTabContent>

        <PrintableTabContent visible={activeSolutionTab === 'Alternative B'}>
          {alternativeB && alternativeSolutionHasFilledFields(alternativeB) && (
            <ProposedBusinessCaseSolutionReview
              name="Alternative B"
              solution={alternativeB}
            />
          )}
        </PrintableTabContent>
      </div>
    </ResponsiveTabs>
  );
};

export default AlternativeAnalysisReview;
