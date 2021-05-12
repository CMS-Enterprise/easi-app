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
  fiscalYear: number;
  asIsSolution: BusinessCaseSolution;
  preferredSolution: ProposedBusinessCaseSolution;
  alternativeA: ProposedBusinessCaseSolution;
  alternativeB?: ProposedBusinessCaseSolution;
};

const AlternativeAnalysisReview = (values: AlternativeAnalysisReviewProps) => {
  const {
    fiscalYear,
    asIsSolution,
    preferredSolution,
    alternativeA,
    alternativeB
  } = values;

  const [activeSolutionTab, setActiveSolutionTab] = useState(
    '"As is" solution'
  );

  const getFilledSolutions = () => {
    const solutions = ['"As is" solution', 'Preferred solution'];

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
        <PrintableTabContent visible={activeSolutionTab === '"As is" solution'}>
          <AsIsSolutionReview fiscalYear={fiscalYear} solution={asIsSolution} />
        </PrintableTabContent>

        <PrintableTabContent
          visible={activeSolutionTab === 'Preferred solution'}
        >
          <ProposedBusinessCaseSolutionReview
            name="Preferred solution"
            fiscalYear={fiscalYear}
            solution={preferredSolution}
          />
        </PrintableTabContent>

        <PrintableTabContent visible={activeSolutionTab === 'Alternative A'}>
          {alternativeA && alternativeSolutionHasFilledFields(alternativeA) && (
            <ProposedBusinessCaseSolutionReview
              name="Alternative A"
              fiscalYear={fiscalYear}
              solution={alternativeA}
            />
          )}
        </PrintableTabContent>

        <PrintableTabContent visible={activeSolutionTab === 'Alternative B'}>
          {alternativeB && alternativeSolutionHasFilledFields(alternativeB) && (
            <ProposedBusinessCaseSolutionReview
              name="Alternative B"
              fiscalYear={fiscalYear}
              solution={alternativeB}
            />
          )}
        </PrintableTabContent>
      </div>
    </ResponsiveTabs>
  );
};

export default AlternativeAnalysisReview;
