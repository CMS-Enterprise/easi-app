import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

// import './index.scss';

const AccessibilityRequestNextStep = () => {
  const { t } = useTranslation('accessibility');

  return (
    <div className="margin-bottom-3">
      <h2 className="margin-y-0 font-heading-lg">
        {t('requestDetails.documents.noDocs.heading')}
      </h2>
      <p className="line-height-body-4">
        <Trans i18nKey="accessibility:requestDetails.documents.noDocs.description">
          indexZero
          <Link
            className="display-inline-block"
            target="_blank"
            rel="noopener noreferrer"
            href="/508/templates"
          >
            linkText
          </Link>
          indexOne
        </Trans>
      </p>
    </div>
  );
};

export default AccessibilityRequestNextStep;
