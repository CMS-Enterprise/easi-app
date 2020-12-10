import React from 'react';
import { useTranslation } from 'react-i18next';

export const AnythingWrongSurvey = () => {
  const { t } = useTranslation();
  return (
    <p className="margin-top-4">
      <a
        href="https://www.surveymonkey.com/r/DM6NYRX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open EASi survey in a new tab"
      >
        {t('general:feedback.anythingWrong')}
      </a>
    </p>
  );
};

export const ImproveEasiSurvey = () => {
  const { t } = useTranslation();
  return (
    <p className="margin-top-4">
      {`${t('general:feedback.improvement')}. `}
      <a
        href="https://www.surveymonkey.com/r/JNYSMZP"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open EASi survey in a new tab"
      >
        {t('general:feedback.whatYouThink')}
      </a>
    </p>
  );
};
