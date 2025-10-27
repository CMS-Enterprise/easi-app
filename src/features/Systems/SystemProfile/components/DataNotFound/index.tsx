import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Icon, Link } from '@trussworks/react-uswds';

import './index.scss';

const DataNotFound = () => {
  const { t } = useTranslation('systemProfile');
  return (
    <div className="data-not-found padding-3 easi-body-medium">
      <div className="display-flex flex-justify">
        <h3 className="margin-top-1 margin-bottom-0">
          {t('dataNotFound.heading')}
        </h3>
        <Icon.Warning
          className="margin-left-1 text-warning top-1"
          aria-hidden
          size={3}
        />
      </div>
      <p>{t('dataNotFound.description')}</p>
      <Trans
        i18nKey="systemProfile:dataNotFound.contact"
        components={{
          emailLink: (
            <Link href="mailto:EnterpriseArchitecture@cms.hhs.gov">
              EnterpriseArchitecture@cms.hhs.gov
            </Link>
          )
        }}
      />
    </div>
  );
};

export default DataNotFound;
