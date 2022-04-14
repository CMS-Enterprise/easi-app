import React from 'react';
import { useTranslation } from 'react-i18next';

import GovernanceOverviewContent from 'components/GovernanceOverview';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import RelatedArticles from 'components/RelatedArticles';

const NewSystem = () => {
  const { t } = useTranslation('newSystem');
  return (
    <>
      <div className="grid-container">
        <HelpBreadcrumb type="Close" />
        <HelpPageIntro
          heading={t('newSystem:heading')}
          subheading={t('newSystem:subheading')}
          type="IT Governance"
        />
        <GovernanceOverviewContent helpArticle className="padding-bottom-3" />
      </div>
      <RelatedArticles type="IT Governance" />
    </>
  );
};

export default NewSystem;
