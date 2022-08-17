import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { IconNavigateBefore } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

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
  const flags = useFlags();

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
        {!flags.helpFooter && <ImproveEasiSurvey />}
        <div>
          <Link
            to={`/governance-task-list/${businessCase.systemIntakeId}`}
            className="display-flex"
          >
            <IconNavigateBefore className="margin-x-05" aria-hidden />
            {t('businessCase:submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
