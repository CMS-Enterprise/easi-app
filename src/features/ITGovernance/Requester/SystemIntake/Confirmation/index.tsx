import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const Confirmation = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');

  return (
    <div className="grid-container margin-bottom-7">
      <div>
        <PageHeading>{t('submission.confirmation.heading')}</PageHeading>
        <h2 className="margin-bottom-8 text-normal">
          {t('submission.confirmation.subheading', {
            referenceId: systemId
          })}
        </h2>
        <div>
          <Link
            to={`/governance-task-list/${systemId}`}
            className="display-flex"
          >
            <Icon.NavigateBefore className="margin-x-05" aria-hidden />
            {t('submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
