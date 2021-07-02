import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const RequestDeleted = () => {
  const { t } = useTranslation('accessibility');
  return (
    <>
      <PageHeading>{t('requestDetails.requestDeleted.heading')}</PageHeading>
      <p>
        <Trans
          i18nKey="accessibility:requestDetails.requestDeleted.body"
          className="margin-0"
        >
          indexZero
          <Link href="mailto:CMS_Section508@cms.hhs.gov">emailLink</Link>
          indexTwo
        </Trans>
      </p>
      <p className="margin-top-3">
        <Link href="/">{t('requestDetails.requestDeleted.homeLinkText')}</Link>
      </p>
    </>
  );
};

export default RequestDeleted;
