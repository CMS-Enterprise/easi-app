import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';

/**
 * Tag that displays whether or not data exists for an externally managed section of system profile.
 */
const ExternalDataTag = ({ hasExternalData }: { hasExternalData: boolean }) => {
  const { t } = useTranslation('systemProfile');

  const TagIcon = hasExternalData ? Icon.CheckCircle : Icon.Warning;

  return (
    <span
      data-testid="external-data-tag"
      className="display-inline-flex flex-align-center line-height-body-3 padding-y-05 padding-left-1 padding-right-105 bg-base-lighter text-base-darker text-bold"
    >
      <TagIcon className="margin-right-1" aria-hidden />
      {hasExternalData
        ? t('editSystemProfile.externalDataExists')
        : t('editSystemProfile.noExternalData')}
    </span>
  );
};

export default ExternalDataTag;
