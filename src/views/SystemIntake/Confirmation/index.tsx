import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { IconNavigateBefore } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import { ImproveEasiSurvey } from 'components/Survey';

const Confirmation = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');
  const flags = useFlags();

  return (
    <div className="grid-container margin-bottom-7">
      <div>
        <PageHeading>{t('submission.confirmation.heading')}</PageHeading>
        <h2 className="margin-bottom-8 text-normal">
          {t('submission.confirmation.subheading', {
            referenceId: systemId
          })}
        </h2>
        {!flags.helpFooter && <ImproveEasiSurvey />}
        <div>
          <Link
            to={`/governance-task-list/${systemId}`}
            className="display-flex"
          >
            <IconNavigateBefore className="margin-x-05" aria-hidden />
            {t('submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
