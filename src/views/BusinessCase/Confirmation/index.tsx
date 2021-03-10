import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { ImproveEasiSurvey } from 'components/Survey';
import { BusinessCaseModel } from 'types/businessCase';

const Confirmation = ({
  businessCase
}: {
  businessCase: BusinessCaseModel;
}) => {
  const { businessCaseId } = useParams();
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
          <Link to={`/governance-task-list/${businessCase.systemIntakeId}`}>
            <i className="fa fa-angle-left margin-x-05" aria-hidden />
            {t('businessCase:submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
