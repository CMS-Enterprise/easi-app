import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

const TermsAndConditions = () => {
  const { t } = useTranslation('termsAndConditions');
  return (
    <div>
      <Header />
      <MainContent className="grid-container line-height-body-5">
        <h1 className="font-heading-xl">{t('heading')}</h1>
        <h2>{t('subheading')}</h2>
        <p className="margin-y-4">{t('unauthorizedUse')}</p>
        <p className="margin-y-4">{t('socialMediaUse')}</p>
        <p className="margin-y-4">{t('consent')}</p>
        <p className="margin-y-4">{t('infoStorage')}</p>
      </MainContent>
    </div>
  );
};

export default TermsAndConditions;
