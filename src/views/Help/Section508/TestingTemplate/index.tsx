import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import TestingTemplatesBase from 'components/TestingTemplates';

const PrepareForGRT = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="Close tab" />
        <TestingTemplatesBase helpArticle />
      </MainContent>
      <div className="margin-top-7">
        <RelatedArticles type="Section 508" />
      </div>
    </>
  );
};

export default PrepareForGRT;
