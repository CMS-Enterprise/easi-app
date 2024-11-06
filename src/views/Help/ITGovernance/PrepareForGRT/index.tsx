import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PrepareForGRTBase from 'components/PrepareForGRT';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRT = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="close" />
        <PrepareForGRTBase helpArticle />
      </MainContent>
      <RelatedArticles
        className="margin-top-7"
        articles={['newSystem', 'sampleBusinessCase', 'governanceReviewBoard']}
      />
    </>
  );
};

export default PrepareForGRT;
