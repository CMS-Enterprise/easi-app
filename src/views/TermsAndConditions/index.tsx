import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <MainContent className="grid-container line-height-body-5">
        <h1 className="font-heading-xl">{t('termsAndConditions:heading')}</h1>
        <h2>{t('termsAndConditions:subheading')}</h2>
        <p className="margin-y-4">{t('termsAndConditions:unauthorizedUse')}</p>
        <p className="margin-y-4">{t('termsAndConditions:socialMediaUse')}</p>
        <p className="margin-y-4">{t('termsAndConditions:consent')}</p>
        <p className="margin-y-4">{t('termsAndConditions:infoStorage')}</p>
      </MainContent>
    </div>
  );
};

export default TermsAndConditions;
