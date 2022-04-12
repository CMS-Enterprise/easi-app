import React from 'react';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import PrepareForGRTBase from 'components/PrepareForGRT';
import RelatedArticles from 'components/RelatedArticles';

const PrepareForGRT = () => {
  return (
    <>
      <HelpBreadcrumb type="Close" />
      <PrepareForGRTBase helpMode />
      <div className="margin-top-7">
        <RelatedArticles type="IT Governance" />
      </div>
    </>
  );
};

export default PrepareForGRT;
