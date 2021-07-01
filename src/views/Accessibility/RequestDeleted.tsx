import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const RequestDeleted = () => {
  const { t } = useTranslation('accessibility');
  return (
    <>
      <PageHeading>{t('requestDetails.requestDeleted.heading')}</PageHeading>
      <p>{t('requestDetails.requestDeleted.body')}</p>
      <p className="margin-top-3">
        <Link href="/">{t('requestDetails.requestDeleted.homeLinkText')}</Link>
      </p>
    </>
  );
};

export default RequestDeleted;
