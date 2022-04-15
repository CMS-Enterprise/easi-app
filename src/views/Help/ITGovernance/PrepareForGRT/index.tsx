import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PrepareForGRTBase from 'components/PrepareForGRT';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRT = () => {
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="Close Tab" />
        <PrepareForGRTBase helpArticle />
      </MainContent>
      <div className="margin-top-7">
        <RelatedArticles type="IT Governance" />
      </div>
    </>
  );
};

export default PrepareForGRT;
