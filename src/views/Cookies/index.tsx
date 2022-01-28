import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const Cookies = () => {
  const { t } = useTranslation();

  const informationStorage: string[] = t(
    'cookies:informationProtection.informationStorage',
    { returnObjects: true }
  );
  const informationNoticeCriteriaList: string[] = t(
    'cookies:informationProtection.informationNoticeCriteriaList',
    { returnObjects: true }
  );

  return (
    <MainContent className="grid-container line-height-body-5">
      <PageHeading>{t('cookies:mainTitle')}</PageHeading>

      {/* Information Usage */}
      <div>
        <h2>{t('cookies:informationUsage.heading')}</h2>
        <Trans i18nKey="cookies:informationUsage.tools">
          <strong>indexZero</strong>&nbsp;indexOne
        </Trans>

        <p>{t('cookies:informationUsage.analysis')}</p>
        <p>{t('cookies:informationUsage.survey')}</p>
        <p>{t('cookies:informationUsage.data')}</p>
      </div>

      {/* Cookie Usage */}
      <div>
        <h2>{t('cookies:cookieUsage.heading')}</h2>

        <p>{t('cookies:cookieUsage.omBudgetMemo')}</p>
        <p>{t('cookies:cookieUsage.generationOfCookies')}</p>
        <p>{t('cookies:cookieUsage.typesOfCookies')}</p>

        <ul>
          <li>
            <strong>{t('cookies:cookieUsage.sessionCookies.label')}</strong>
            &nbsp;
            <span>{t('cookies:cookieUsage.sessionCookies.info')}</span>
          </li>
          <li>
            <strong>{t('cookies:cookieUsage.persistentCookies.label')}</strong>
            &nbsp;
            <span>{t('cookies:cookieUsage.persistentCookies.info')}</span>
          </li>
        </ul>
      </div>

      {/* Disable Cookies */}
      <div>
        <h2>{t('cookies:disableCookies.heading')}</h2>
        <p>
          {t('cookies:disableCookies.info')}
          <Link
            aria-label="Open 'Cookies opt-out' in a new tab"
            href="http://www.usa.gov/optout_instructions.shtml"
            target="_blank"
            rel="noopener noreferrer"
            variant="external"
          >
            {t('cookies:disableCookies.howToLink')}
          </Link>
        </p>
        <p>{t('cookies:disableCookies.notice')}</p>
      </div>

      {/* Information Protection */}
      <div>
        <h2>{t('cookies:informationProtection.heading')}</h2>
        {informationStorage.map(k => (
          <p key={k}>{k}</p>
        ))}

        <ol>
          {informationNoticeCriteriaList.map(k => (
            <li key={k}>{k}</li>
          ))}
        </ol>

        <p>
          {t('cookies:informationProtection.furtherInfo')}
          <Link href="mailto:Privacy@cms.hhs.gov">
            {t('cookies:informationProtection.privacyEmail')}
          </Link>
        </p>
      </div>
    </MainContent>
  );
};

export default Cookies;
