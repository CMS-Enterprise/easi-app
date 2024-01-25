import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PrepareForGRBBase from 'components/PrepareForGRB';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRB = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="close" />
        <PrepareForGRBBase helpArticle />
      </MainContent>
      <div className="margin-top-7">
        <RelatedArticles
          type="IT Governance"
          currentArticle="governanceReviewBoard"
        />
      </div>
    </>
  );
};

export default PrepareForGRB;
