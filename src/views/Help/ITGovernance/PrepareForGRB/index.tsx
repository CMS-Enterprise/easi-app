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
      <RelatedArticles
        articles={['newSystem', 'sampleBusinessCase', 'governanceReviewTeam']}
        className="margin-top-7"
      />
    </>
  );
};

export default PrepareForGRB;
