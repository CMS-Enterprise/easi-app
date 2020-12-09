import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { ImproveEasiSurvey } from 'components/Survey';
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
        <ImproveEasiSurvey />
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
