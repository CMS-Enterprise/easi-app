import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PrepareForGRBBase from 'components/PrepareForGRB';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRB = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="Close tab" />
        <PrepareForGRBBase helpArticle />
      </MainContent>
      <div className="margin-top-7">
        <RelatedArticles type="IT Governance" />
      </div>
    </>
  );
};

export default PrepareForGRB;
