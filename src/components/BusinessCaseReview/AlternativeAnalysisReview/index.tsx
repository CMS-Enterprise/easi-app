import React, { useState } from 'react';

import PrintableTabContent from 'components/PrintableTabContent';
import ResponsiveTabs from 'components/shared/ResponsiveTabs';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { ProposedBusinessCaseSolution } from 'types/businessCase';
import ProposedBusinessCaseSolutionReview from 'views/BusinessCase/Review/ProposedBusinessCaseSolutionReview';

type AlternativeAnalysisReviewProps = {
  fiscalYear: number;
  preferredSolution: ProposedBusinessCaseSolution;
  alternativeA: ProposedBusinessCaseSolution;
  alternativeB?: ProposedBusinessCaseSolution;
};

const AlternativeAnalysisReview = (values: AlternativeAnalysisReviewProps) => {
  const { fiscalYear, preferredSolution, alternativeA, alternativeB } = values;

  const [activeSolutionTab, setActiveSolutionTab] = useState(
    'Preferred solution'
  );

  const getFilledSolutions = () => {
    const solutions = ['Preferred solution'];

    if (alternativeA && alternativeSolutionHasFilledFields(alternativeA)) {
      solutions.push('Alternative A');
    }
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
        <PrintableTabContent
          visible={activeSolutionTab === 'Preferred solution'}
        >
          <ProposedBusinessCaseSolutionReview
            name="Preferred solution"
            fiscalYear={fiscalYear}
            solution={preferredSolution}
          />
        </PrintableTabContent>
        {alternativeA && alternativeSolutionHasFilledFields(alternativeA) && (
          <PrintableTabContent visible={activeSolutionTab === 'Alternative A'}>
            <ProposedBusinessCaseSolutionReview
              name="Alternative A"
              fiscalYear={fiscalYear}
              solution={alternativeA}
            />
          </PrintableTabContent>
        )}
        {alternativeB && alternativeSolutionHasFilledFields(alternativeB) && (
          <PrintableTabContent visible={activeSolutionTab === 'Alternative B'}>
            <ProposedBusinessCaseSolutionReview
              name="Alternative B"
              fiscalYear={fiscalYear}
              solution={alternativeB}
            />
          </PrintableTabContent>
        )}
      </div>
    </ResponsiveTabs>
  );
};

export default AlternativeAnalysisReview;
