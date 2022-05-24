import React from 'react';

import BusinessCaseReview from 'components/BusinessCaseReview';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';

import sampleBusinessCaseData from './sampleBusinessCaseData';

export default function SampleBusinessCase() {
  return (
    <MainContent className="grid-container">
      <HelpBreadcrumb type="Close tab" />
      <HelpPageIntro
        heading="Sample Business Case"
        subheading="This sample Business Case can help you as you fill out your own Business Case. The content here is an example of how complete and precise to be when completing your Business Case."
        type="IT Governance"
      />
      <BusinessCaseReview values={sampleBusinessCaseData} helpArticle />
    </MainContent>
  );
}
