import React from 'react';
import { useTranslation } from 'react-i18next';

export const AnythingWrongSurvey = () => {
  const { t } = useTranslation();
  return (
    <div className="margin-top-4">
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
  const { t } = useTranslation();
  // Period and space to be added between translations since they are on same line
  const periodSpace = '. ';
  return (
    <div className="margin-top-4">
      <p>
        {t('general:feedback.improvement') + periodSpace}
        <a
          href="https://www.surveymonkey.com/r/JNYSMZP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open EASi survey in a new tab"
        >
          {t('general:feedback.whatYouThink')}
        </a>
      </p>
    </div>
  );
};

/* This version is only for decision pages, it has a header so that it fits
  with the theme of the pages */
export const ImproveEasiDecisionPageSurvey = () => {
  const { t } = useTranslation();
  return (
    <div className="margin-top-4">
      <p>
        <h3>{t('general:feedback.improvement')}</h3>
        <a
          href="https://www.surveymonkey.com/r/JNYSMZP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open EASi survey in a new tab"
        >
          {t('general:feedback.whatYouThink')}
        </a>
      </p>
    </div>
  );
};
