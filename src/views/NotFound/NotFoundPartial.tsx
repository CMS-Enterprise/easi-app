import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import './index.scss';

const NotFoundPartial = () => {
  const { t } = useTranslation();
  const listItems: string[] = t('error:notFound.list', { returnObjects: true });

  return (
    <div className="margin-y-7">
      <PageHeading>{t('error:notFound.heading')}</PageHeading>
      <p>{t('error:notFound.thingsToTry')}</p>

      <ul className="easi-not-found__error_suggestions">
        {listItems.map(item => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
      <p className="margin-bottom-5">{t('error:notFound.tryAgain')}</p>
      <UswdsReactLink className="usa-button" variant="unstyled" link="/">
        {t('error:notFound.goHome')}
      </UswdsReactLink>
    </div>
  );
};

export default NotFoundPartial;
