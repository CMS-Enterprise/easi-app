import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const AnythingWrongSurvey = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        <a
          href="https://www.surveymonkey.com/r/DM6NYRX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open EASi survey in a new tab"
        >
          {t('general:feedback.anythingWrong')}
        </a>
      </p>
    </div>
  );
};

/* There are multiple versions of the Improve EASi survey depending on format of
  page it is being added to */

// This is the common version for most pages
export const ImproveEasiSurvey = () => {
  return (
    <div>
      <p>
        <Trans i18nKey="general:feedback.improveEasi">
          helpUsImproveEasi
          <a
            href="https://www.surveymonkey.com/r/JNYSMZP"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open EASi survey in a new tab"
          >
            tellUsWhatYouThink
          </a>
        </Trans>
      </p>
    </div>
  );
};

/* This version is only for decision pages, it has a header so that it fits
  with the theme of the pages */
export const ImproveEasiDecisionPageSurvey = () => {
  return (
    <div>
      <p>
        <Trans i18nKey="general:feedback.improveEasi">
          <h3>helpUsImproveEasi</h3>
          <a
            href="https://www.surveymonkey.com/r/JNYSMZP"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open EASi survey in a new tab"
          >
            tellUsWhatYouThink
          </a>
        </Trans>
      </p>
    </div>
  );
};
