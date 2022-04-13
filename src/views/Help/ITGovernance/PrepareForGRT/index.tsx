import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PrepareForGRTBase from 'components/PrepareForGRT';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRT = () => {
  return (
    <MainContent>
      <div className="grid-container">
        <HelpBreadcrumb type="Close" />
        <PrepareForGRTBase helpMode />
      </div>
      <div className="margin-top-7">
        <RelatedArticles type="IT Governance" />
      </div>
    </MainContent>
  );
};

export default PrepareForGRT;
