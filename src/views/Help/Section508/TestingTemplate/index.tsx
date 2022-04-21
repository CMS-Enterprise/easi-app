import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import TestingTemplates from 'views/Accessibility/TestingTemplates';

const PrepareForGRT = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="Close tab" />
        <TestingTemplates />
      </MainContent>
      <div className="margin-top-7">
        <RelatedArticles type="Section 508" />
      </div>
    </>
  );
};

export default PrepareForGRT;
