import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import PrepareForGRTBase from 'components/PrepareForGRT';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRT = () => {
  return (
    <>
      <div className="grid-container">
        <HelpBreadcrumb type="Close Tab" />
        <PrepareForGRTBase helpMode />
      </div>
      <div className="margin-top-7">
        <RelatedArticles type="IT Governance" />
      </div>
    </>
  );
};

export default PrepareForGRT;
