import React from 'react';
import { useTranslation } from 'react-i18next';

import AccessibilityTestingSteps from 'components/AccessibilityTestingSteps';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';

const StepsInvolved = () => {
  const { t } = useTranslation('accessibility');
  return (
    <>
      <MainContent className="grid-container margin-bottom-3">
        <HelpBreadcrumb type="Close tab" />
        <HelpPageIntro
          heading={t('accessibility:testingStepsOverview.heading')}
          subheading={t('accessibility:testingStepsOverview.description')}
          type="Section 508"
        />
        <h2 className="margin-bottom-2">
          {t('testingStepsOverview.subheading')}
        </h2>
        <AccessibilityTestingSteps helpArticle />
      </MainContent>
      <RelatedArticles type="IT Governance" />
    </>
  );
};

export default StepsInvolved;
