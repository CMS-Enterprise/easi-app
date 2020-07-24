import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

const Confirmation = () => {
  const { businessCaseId } = useParams();
  const { t } = useTranslation();
  return (
    <div className="margin-bottom-7">
      <div className="grid-container">
        <h1 className="font-heading-xl margin-top-4">
          {t('businessCase:submission.confirmation.heading')}
        </h1>
        <h2 className="margin-bottom-8 text-normal">
          {t('businessCase:submission.confirmation.subheading', {
            referenceId: businessCaseId
          })}
        </h2>
        <p className="margin-y-8">
          <Trans i18nKey="businessCase:submission.confirmation.improveEasi">
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
        <div>
          <Link to="/">
            <i className="fa fa-angle-left margin-x-05" aria-hidden />
            {t('businessCase:submission.confirmation.homeCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
