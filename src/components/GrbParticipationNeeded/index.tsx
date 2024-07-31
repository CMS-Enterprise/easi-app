import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconGroups,
  IconVisibilityOff,
  IconVisiblity
} from '@trussworks/react-uswds';

import IconButton from 'components/shared/IconButton';

const GrbParticipationNeeded = () => {
  const { t } = useTranslation('grbReview');

  // Toggles GRB reviews table
  const [showGrbReviews, setShowGrbReviews] = useState<boolean>(false);

  return (
    <div className="bg-primary-lighter padding-4">
      <div className="display-flex flex-align-start flex-justify">
        <h2 className="margin-y-0 margin-right-2">
          {t('homepage.participationNeeded')}
        </h2>
        <IconGroups size={4} className="text-primary" />
      </div>

      <p className="line-height-body-5 margin-top-1 margin-bottom-3">
        {t('homepage.participationNeededText')}
      </p>

      {/* Toggle GRB reviews button */}
      <IconButton
        onClick={() => setShowGrbReviews(!showGrbReviews)}
        icon={showGrbReviews ? <IconVisibilityOff /> : <IconVisiblity />}
        type="button"
        unstyled
      >
        {showGrbReviews
          ? t('homepage.hideGrbReviews')
          : t('homepage.showGrbReviews')}
      </IconButton>
    </div>
  );
};

export default GrbParticipationNeeded;
