import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

type ResolutionBoxProps = {
  title: string;
  systemIntakeId: string;
};

/**
 * Displays selected resolution and link to change resolution
 */
const ResolutionBox = ({ title, systemIntakeId }: ResolutionBoxProps) => {
  const { t } = useTranslation('action');

  return (
    <div className="margin-top-3 margin-bottom-105 bg-base-lightest tablet:grid-col-6 padding-3">
      <p className="margin-0">{t('resolutions.selectedResolution')}</p>
      <h3 className="margin-top-05 margin-bottom-105">{t(title)}</h3>
      <Link href={`/governance-review-team/${systemIntakeId}/resolutions`}>
        {t('resolutions.changeResolution')}
      </Link>
    </div>
  );
};

export default ResolutionBox;
