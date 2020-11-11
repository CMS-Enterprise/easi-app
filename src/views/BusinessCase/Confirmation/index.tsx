import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { useFlags } from 'contexts/flagContext';
import { BusinessCaseModel } from 'types/businessCase';

const Confirmation = ({
  businessCase
}: {
  businessCase: BusinessCaseModel;
}) => {
  const { businessCaseId } = useParams();
  const flags = useFlags();
  const { t } = useTranslation();

  return (
    <div className="grid-container margin-bottom-7">
      <div>
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
          {flags.taskListLite ? (
            <Link to={`/governance-task-list/${businessCase.systemIntakeId}`}>
              <i className="fa fa-angle-left margin-x-05" aria-hidden />
              {t('businessCase:submission.confirmation.taskListCta')}
            </Link>
          ) : (
            <Link to="/">
              <i className="fa fa-angle-left margin-x-05" aria-hidden />
              {t('businessCase:submission.confirmation.homeCta')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
