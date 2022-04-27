import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import TestingTemplatesBase from 'components/TestingTemplates';

const TestingTemplates = () => {
  return (
    <>
      <MainContent className="grid-container margin-bottom-7">
        <HelpBreadcrumb type="Close tab" />
        <TestingTemplatesBase helpArticle />
      </MainContent>
      <RelatedArticles type="Section 508" />
    </>
  );
};

export default TestingTemplates;
