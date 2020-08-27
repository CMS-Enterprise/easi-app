import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

import './index.scss';

const NotFound = () => {
  const { t } = useTranslation();
  const listItems: string[] = t('error:notFound.list', { returnObjects: true });
  return (
    <div className="easi-not-found">
      <Header />
      <MainContent className="grid-container">
        <div className="margin-y-7">
          <h1 className="font-heading-3xl">{t('error:notFound.heading')}</h1>
          <p>{t('error:notFound.thingsToTry')}</p>

          <ul className="easi-not-found__error_suggestions">
            {listItems.map(item => {
              return <li key={item}>{item}</li>;
            })}
          </ul>
          <p className="margin-bottom-5">{t('error:notFound.tryAgain')}</p>
          <UswdsLink className="usa-button" variant="unstyled" href="/">
            {t('error:notFound.goHome')}
          </UswdsLink>
        </div>
      </MainContent>
    </div>
  );
};

export default NotFound;
