import React from 'react';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { Trans, useTranslation } from 'react-i18next';

const Cookies = () => {
  const { t } = useTranslation();

  const informationUsageParagraphs: string[] = t(
    'cookies:informationUsageParagraphs',
    { returnObjects: true }
  );
  const cookiesUsageParagraphs: string[] = t('cookies:cookiesUsageParagraphs', {
    returnObjects: true
  });
  const cookieTypeList: string[] = t('cookies:cookieTypeList', {
    returnObjects: true
  });
  const informationProtectionParagraphs: string[] = t(
    'cookies:informationProtectionParagraphs',
    { returnObjects: true }
  );
  const informationNoticeCriteriaList: string[] = t(
    'cookies:informationNoticeCriteriaList',
    { returnObjects: true }
  );

  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        {/* Surround in Trans tags to properly format embedded HTML tags in i18n file */}
        <Trans>
          <h1>{t('cookies:mainTitle')}</h1>

          {/* Information Usage */}
          <h2>{t('cookies:informationUsageTitle')}</h2>
          <p>
            {informationUsageParagraphs.map(k => (
              <p key={k}>{k}</p>
            ))}
          </p>

          {/* Cookie Usage */}
          <h2>{t('cookies:cookiesUsageTitle')}</h2>
          <p>
            {cookiesUsageParagraphs.map(k => (
              <p key={k}>{k}</p>
            ))}
          </p>

          <ul>
            {cookieTypeList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          {/* Disable Cookies */}
          <h2>{t('cookies:disableCookiesTitle')}</h2>
          <p>
            {t('cookies:disableCookiesParagraph1')}
            <a href="http://www.usa.gov/optout_instructions.shtml">
              {t('cookies:disableCookiesLink')}
            </a>
          </p>

          <p>{t('cookies:disableCookiesParagraph2')}</p>

          {/* Information Protection */}
          <h2>{t('cookies:informationProtectionTitle')}</h2>
          <p>
            {informationProtectionParagraphs.map(k => (
              <p key={k}>{k}</p>
            ))}
          </p>

          <ol>
            {informationNoticeCriteriaList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ol>

          <p>
            {t('cookies:informationProtectionFurtherInfoParagraph')}
            <a href="mailto:Privacy@cms.hhs.gov">
              {t('informationProtectionFurtherInfoEmail')}
            </a>
          </p>
        </Trans>
      </MainContent>
    </div>
  );
};

export default Cookies;
