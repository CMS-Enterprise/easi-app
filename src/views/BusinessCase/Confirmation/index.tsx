import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import PageHeading from 'components/PageHeading';
import { ImproveEasiSurvey } from 'components/Survey';
import { BusinessCaseModel } from 'types/businessCase';

const Confirmation = ({
  businessCase
}: {
  businessCase: BusinessCaseModel;
}) => {
  const { businessCaseId } = useParams<{ businessCaseId: string }>();
  const { t } = useTranslation();

  return (
    <div className="grid-container margin-bottom-7">
      <div>
        <PageHeading>
          {t('businessCase:submission.confirmation.heading')}
        </PageHeading>
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
