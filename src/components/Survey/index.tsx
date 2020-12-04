import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const SurveyTypeEnum = {
  IMPROVE_EASI: 1,
  ANYTHING_WRONG: 2
};

type SurveyProps = {
  surveyType: number;
};

const Survey = ({ surveyType }: SurveyProps) => {
  const { t } = useTranslation();

  function GetSurvey(props: any) {
    switch (props.value) {
      case SurveyTypeEnum.IMPROVE_EASI:
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
      case SurveyTypeEnum.ANYTHING_WRONG:
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
      default:
        return null;
    }
  }

  return <GetSurvey value={surveyType} />;
};

export default Survey;
