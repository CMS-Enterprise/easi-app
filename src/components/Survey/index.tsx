import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const AnythingWrongSurvey = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="margin-y-4">
        <a
          href="https://www.surveymonkey.com/r/DM6NYRX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open EASi survey in a new tab"
        >
          {t('survey:anythingWrong')}
        </a>
      </p>
    </div>
  );
};

export const ImproveEasiSurvey = () => {
  return (
    <div>
      <p className="margin-y-4">
        <Trans i18nKey="survey:improveEasi">
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
